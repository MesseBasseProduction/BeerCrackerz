#!/bin/bash
vers="0.1.0"


# Method to check if given command is installed on the system
isInstalled() {
  command -v "$1" >/dev/null 2>&1
  if [[ $? -ne 0 ]]; then
    echo -e "\e[31mERROR\e[39m $1 is not installed on the system"
    echo -e "      Ensure docker, docker-compose and npm are installed"
    echo -e "      On a production environment, nginx must be installed as well"
    echo -e "      -> https://github.com/MesseBasseProduction/BeerCrackerz/wiki"
    exit 0
  fi
}


# Script header
echo # Line break
echo -e "  ## ---------------------------------- ##"
echo -e "  ##            \e[92mBeerCrackerz\e[39m            ##"
echo -e "  ##        2022/2023 -- GPL-3.0        ##"
echo -e "  ##               v$vers               ##"
echo -e "  ## ---------------------------------- ##"
echo # Line break


# First of all, test if user has send an argument
if [ $# -eq 0 ]; then
  echo -e "bc.sh : Missing argument\n"
  echo -e "\e[31mERROR\e[39m Command executed without any arguments"
  echo -e "      Check command help for available arguments: ./bc.sh --help"
  exit 0
fi


# Initialization sequence, fill .env file to fit user inputs and build docker images
if [ "$1" = "-i" ] || [ "$1" = "--install" ]; then
  echo -e "bc.sh $1 : BeerCrackerz installation\n"
  # Check if all dependencies are installed
  for COMMAND in "docker" "docker-compose" "npm"; do
    isInstalled "${COMMAND}"
  done
  basedir=$(dirname "$0")
  # Check for previous existing .env files
  if [ -f "$basedir"/.conf/development/conf.env ]; then
    echo -e "\e[93mWARNING\e[39m BeerCrackerz is already configured"
    replaceconf="bc" # Can't init to blank to get in while read loop
    # Wait for user to send yY/nN or blank
    while [[ "$replaceconf" != "" && "$replaceconf" != "y" && "$replaceconf" != "Y" && "$replaceconf" != "n" && "$replaceconf" != "N" ]]; do
      read -rp "        Do you want to override this configuration? [y/N] " replaceconf
    done
    # Exit if user didn't enter anything, or entered n/N
    if [ "$replaceconf" = "" ] || [ "$replaceconf" = "n" ] || [ "$replaceconf" = "N" ]; then
      exit 0
    else
      rm -rf "$basedir"/.conf/development/conf.env # Clear previous .env files as it is recreated later
      rm -rf "$basedir"/.conf/production/conf.server.env
      rm -rf "$basedir"/.conf/production/conf.local.env
      echo # Line break
    fi
  fi
  echo -e "Welcome to the BeerCrackerz installation wizard!"
  echo -e "Ensure you've read the installation entry of the wiki before going any further"
  echo -e "-> https://github.com/BeerCrackerz/BeerCrackerz/wiki\n"
  echo -e "Please fill the following information to properly configure BeerCrackerz :\n"
  # Request info from user
  unset backsecretkey
  while [ -z $backsecretkey ]; do
    read -rp "  1/7. The backend secret key : " backsecretkey
  done
  # Database password (not empty and >4 characters)
  unset dbuser
  while [ -z $dbuser ]; do
    read -rp "  2/7. The database username : " dbuser
  done
  # Database password (not empty and >4 characters)
  unset dbpassword
  while [[ $dbpassword = "" || ${#dbpassword} -lt 4 ]]; do
    read -rp "  3/7. The database password (> 4 characters) : " dbpassword
  done
  # Database password (not empty and >4 characters)
  unset email
  while [ -z $email ]; do
    read -rp "  4/7. The administrator email : " email
  done
  # Database password (not empty and >4 characters)
  unset domain
  while [ -z $domain ]; do
    read -rp "  5/7. The production domain (without http/https) : " domain
  done
  # Library path (not empty and an existing directory on system)
  unset mailjetapi
  while [ -z $mailjetapi ]; do
    read -rp "  6/7. The MailJet API key : " mailjetapi
  done
  # Resources path (not empty and an existing directory on system)
  unset mailjetsecret
  while [ -z $mailjetsecret ]; do
    read -rp "  7/7. The MailJet API secret : " mailjetsecret
  done
  # Create deveopment/conf.env file
  touch "$basedir"/.conf/development/conf.env
  { echo "# NGINX"
    echo "NGINX_NAME=beer_crackerz_nginx"
    echo "SERVER_HOST=localhost"
    echo "SERVER_HTTP_PORT=8080"
    echo ""
    echo "# DATABASE"
    echo "DB_POSTGRES_VERSION=14.2-alpine"
    echo "DB_HOST=beer_crackerz_db"
    echo "DB_PORT=5432"
    echo "DB_NAME=beer_crackerz"
    echo "DB_USER=$dbuser"
    echo "DB_PASSWORD=$dbpassword"
    echo ""
    echo "# ADMINER"
    echo "DB_ADMINER_NAME=beer_crackerz_adminer"
    echo "DB_ADMINER_PORT=8081"
    echo "DB_ADMINER_CONTAINER_PORT=8080"
    echo ""
    echo "# BACKEND"
    echo "BACKEND_NAME=beer_crackerz_back"
    echo "BACKEND_PORT=8000"
    echo "BACKEND_DEBUG=1"
    echo "BACKEND_ALLOWED_HOSTS=*"
    echo "BACKEND_USE_EMAIL_FILE_SYSTEM=1"
    echo "BACKEND_SECRET_KEY=$backsecretkey"
    echo "CSRF_TRUSTED_ORIGINS=http://localhost:8080;http://127.0.0.1:8080"
    echo ""
    echo "# MAILJET"
    echo "MAILJET_API_KEY=$mailjetapi"
    echo "MAILJET_API_SECRET=$mailjetsecret"
  } >> "$basedir"/.conf/development/conf.env
  # Create .conf/production/conf.local.env file
  touch "$basedir"/.conf/production/conf.local.env
  { echo "# NGINX"
    echo "NGINX_NAME=beer_crackerz_nginx"
    echo "SERVER_HOST=localhost"
    echo "SERVER_HTTP_PORT=80"
    echo "SERVER_HTTPS_PORT=443"
    echo "SERVER_PROTOCOL=https"
    echo "CERTBOT_EMAIL=$email"
    echo "CERT_NAME=beer_crackerz"
    echo "CERTBOT_STAGING=1"
    echo "CERTBOT_LOCAL_CA=1"
    echo ""
    echo "# DATABASE"
    echo "DB_POSTGRES_VERSION=14.2-alpine"
    echo "DB_HOST=beer_crackerz_db"
    echo "DB_PORT=5432"
    echo "DB_NAME=beer_crackerz"
    echo "DB_USER=$dbuser"
    echo "DB_PASSWORD=$dbpassword"
    echo ""
    echo "# BACKEND"
    echo "BACKEND_NAME=beer_crackerz_back"
    echo "BACKEND_PORT=8000"
    echo "BACKEND_DEBUG=1"
    echo "BACKEND_ALLOWED_HOSTS=localhost"
    echo "BACKEND_USE_EMAIL_FILE_SYSTEM=1"
    echo "BACKEND_SECRET_KEY=$backsecretkey"
    echo "CSRF_TRUSTED_ORIGINS=https://localhost;http://127.0.0.1"
    echo ""
    echo "# MAILJET"
    echo "MAILJET_API_KEY=$mailjetapi"
    echo "MAILJET_API_SECRET=$mailjetsecret"
  } >> "$basedir"/.conf/production/conf.local.env
  # Create .conf/production/conf.server.env file
  touch "$basedir"/.conf/production/conf.server.env
  { echo "# NGINX"
    echo "NGINX_NAME=beer_crackerz_nginx"
    echo "SERVER_HOST=$domain"
    echo "SERVER_HTTP_PORT=80"
    echo "SERVER_HTTPS_PORT=443"
    echo "SERVER_PROTOCOL=https"
    echo "CERTBOT_EMAIL=$email"
    echo "CERT_NAME=beer_crackerz"
    echo "CERTBOT_STAGING=0"
    echo "CERTBOT_LOCAL_CA=0"
    echo ""
    echo "# DATABASE"
    echo "DB_POSTGRES_VERSION=14.2-alpine"
    echo "DB_HOST=beer_crackerz_db"
    echo "DB_PORT=5432"
    echo "DB_NAME=beer_crackerz"
    echo "DB_USER=$dbuser"
    echo "DB_PASSWORD=$dbpassword"
    echo ""
    echo "# BACKEND"
    echo "BACKEND_NAME=beer_crackerz_back"
    echo "BACKEND_PORT=8000"
    echo "BACKEND_DEBUG=0"
    echo "BACKEND_ALLOWED_HOSTS=$domain"
    echo "BACKEND_USE_EMAIL_FILE_SYSTEM=0"
    echo "BACKEND_SECRET_KEY=$backsecretkey"
    echo "CSRF_TRUSTED_ORIGINS=https://$domain"
    echo ""
    echo "# MAILJET"
    echo "MAILJET_API_KEY=$mailjetapi"
    echo "MAILJET_API_SECRET=$mailjetsecret"
  } >> "$basedir"/.conf/production/conf.server.env
  echo # Line break
  echo -e "\e[32mSUCCESS\e[39m .env configuration files created. BeerCrackerz was successfully configured and installed!"
  echo -e "        You can now run ./bc.sh --build then ./bc.sh --s to start BeerCrackerz"


# Building BeerCrackerz containers in either dev or prod mode
elif [ "$1" = '-b' ] || [ "$1" = '--build' ]; then
  # No optional argument, prod build
  if [ -z "$2" ]; then
    echo -e "bc.sh $1 : Build BeerCrackerz in production mode\n"
    echo -e "Building BeerCrackerz in production mode by default. Specify [dev/prod] otherwise"
    eval "docker-compose --file docker-compose.prod.yml --env-file .conf/production/conf.server.env build"
    echo -e "BeerCrackerz succesfully built. Now run ./bc.sh -s [dev/prod] to launch the app"
  else
    # Dev build
    if [ "$2" = "dev" ]; then
      echo -e "bc.sh $1 $2 : Build BeerCrackerz in development mode\n"
      echo -e "Building BeerCrackerz in development mode"
      eval "docker-compose --file docker-compose.yml --env-file .conf/development/conf.env build"
      echo -e "BeerCrackerz succesfully built. Now run ./bc.sh -s [dev/prod] to launch the app"
    # Prod Build
    elif [ "$2" = "prod" ]; then
      echo -e "bc.sh $1 $2 : Build BeerCrackerz in production mode\n"
      echo -e "Building BeerCrackerz in production mode"
      eval "docker-compose --file docker-compose.prod.yml --env-file .conf/production/conf.server.env build"
      echo -e "BeerCrackerz succesfully built. Now run ./bc.sh -s [dev/prod] to launch the app"
    # Invalid argument
    else
      echo -e "\e[31mERROR\e[39m $2 is not a supported argument to build BeerCrackerz"
      echo -e "      Check command help for available arguments: ./bc.sh --help"
      exit 0
    fi
  fi


# Start BeerCrackerz application in either dev or prod mode
elif [ "$1" = '-s' ] || [ "$1" = '--start' ]; then
  # No optional arguments provided, fallback to production mode
  if [ -z "$2" ]; then
    echo -e "bc.sh $1 : Start BeerCrackerz application in production mode\n"
    echo -e "Starting BeerCrackerz in production mode by default. Specify [dev/prod] otherwise"
    eval "docker-compose --file docker-compose.prod.yml --env-file .conf/production/conf.server.env up -d"
    eval "npm run build"
    echo -e "If this is the first start, please run the following command when the app is started : $ docker exec -it beer_crackerz_back python manage.py createsuperuser"
  # Mode was specified by command caller
  else
    # Building only the back container with logs
    if [ "$2" = "dev" ]; then
      echo -e "bc.sh $1 $2 : Start BeerCrackerz application in development mode\n"
      echo -e "Starting BeerCrackerz in development mode"
      eval "docker-compose --file docker-compose.yml --env-file .conf/development/conf.env up -d"
      echo -e "If this is the first start, please run the following command when the app is started : $ docker exec -it beer_crackerz_back python manage.py createsuperuser"
      eval "npm run watch"
    # Selective build not supported
    elif [ "$2" = "prod" ]; then
      echo -e "bc.sh $1 : Start BeerCrackerz application in production mode\n"
      echo -e "Starting BeerCrackerz in production mode"
      eval "docker-compose --file docker-compose.prod.yml --env-file .conf/production/conf.server.env up -d"
      eval "npm run build"
      echo -e "If this is the first start, please run the following command when the app is started : $ docker exec -it beer_crackerz_back python manage.py createsuperuser"
    else
      echo -e "\e[31mERROR\e[39m $2 is not supported as a runtime mode"
      echo -e "      Check command help for available arguments: ./bc.sh --help"
      exit 0
    fi
  fi


# Start BeerCrackerz application in either dev or prod mode
elif [ "$1" = '-q' ] || [ "$1" = '--quit' ]; then
  echo -e "bc.sh $1 $2 : Quit BeerCrackerz application\n"
  echo -e "Stoping BeerCrackerz containers"
  eval "docker-compose --file ./docker-compose.prod.yml --env-file ./.conf/production/conf.server.env down"


# Reset BeerCrackerz, clear database files and docker images
elif [ "$1" = "-r" ] || [ "$1" = "--reset" ]; then
  echo -e "bc.sh $1 : Reset BeerCrackerz instance\n"
  # Warn user that the command will remove database and images
  echo -e "\e[93mWARNING\e[39m This command will erase any existing database and BeerCrackerz' docker images"
  resetBc="bc" # Can't init to blank to get in while read loop
  # Wait for user to send yY/nN or blank
  while [[ "$resetBc" != "" && "$resetBc" != "y" && "$resetBc" != "Y" && "$resetBc" != "n" && "$resetBc" != "N" ]]; do
    read -rp "        Do you want to fully reset BeerCrackerz? [y/N] " resetBc
  done
  # Exit if user didn't enter anything, or entered n/N
  if [ "$resetBc" = "" ] || [ "$resetBc" = "n" ] || [ "$resetBc" = "N" ]; then
    exit 0
  fi
  # Ensure all docker are stopped
  echo # Line break
  echo -e "1/3. Stopping any BeerCrackerz containers"
  eval "docker-compose stop"
  echo # Line break
  # Remove BeerCrackerz's related dockers
  echo -e "2/3. Removing BeerCrackerz containers"
  eval "docker-compose down -v --rmi all --remove-orphans"
  echo # Line break
  # Reset hard argument
  if [ "$2" = "hard" ]; then
    echo -e "3/3. Remove all existing docker images\n"
    eval "docker system prune"
    echo -e "\n\e[32mSUCCESS\e[39m BeerCrackerz was properly reset!"
    echo -e "        You can now run ./bc.sh --build [dev/prod] to build docker images again"
  # Rebuild the whole thing otherwise
  else
    echo -e "3/3. Complete BeerCrackerz reset"
    echo -e "\n\e[32mSUCCESS\e[39m BeerCrackerz was properly reset!"
    echo -e "        You can now run ./bc.sh --build [dev/prod] to build docker images again"
  fi


# Gource version control visualization
elif [ "$1" = '-g' ] || [ "$1" = '--gource' ]; then
  echo -e "bc.sh $1 : Gource visualization\n"
  # Check if gource is installed on the system
  isInstalled "gource"
  # Start gource with custom parameters
  gourceOptions="--fullscreen --multi-sampling --auto-skip-seconds 0.1 --seconds-per-day 0.15 --elasticity 0.02 \
           --camera-mode overview --font-size 18 --stop-at-end --bloom-intensity 0.5 --date-format '%d %B %Y' --hide mouse,progress \
           --title 'BeerCrackerz - version $vers, Messe Basse Production 2022/2023' --logo ./static/img/logo-tiny.png --user-image-dir ./static/img/about"
  ffmpegOptions="--output-ppm-stream - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset medium -crf 1 -threads 0 -bf 0 bc-git-history.mp4"
  if [ -z "$2" ]; then
    eval "gource $gourceOptions"
  else
    if [ "$2" = 'save' ]; then
      echo -e "Exporting gource visualization as a mp4 file"
      eval "gource $gourceOptions $ffmpegOptions"
    else
      echo -e "\e[31mERROR\e[39m $2 is not supported as an option"
      echo -e "      Check command help for available arguments: ./bc.sh --help"
      exit 0
    fi
  fi

# Command help and usage
elif [ "$1" = '-h' ] || [ "$1" = '--help' ]; then
  echo -e "bc.sh $1 : Command help\n"
  echo -e "Usage : ./bc.sh [command] [optional argument]\n"
  echo -e "  -h, --help         Display command usage\n\n"
  echo -e "  -i, --install      Configure and install BeerCrackerz on the system"
  echo -e "                     Create .env file with your parameters\n"
  echo -e "  -b, --build        Build the docker containers"
  echo -e "                     Optional argument [dev/prod], will use prod if none are provided\n"
  echo -e "  -s, --start        Start BeerCrackerz application"
  echo -e "                     Optional argument [dev/prod], will use prod if none are provided\n"
  echo -e "  -q, --quit         Stop any running BeerCrackerz application"
  echo -e "  -r, --reset        Remove existing database and BeerCrackerz docker images and rebuild them"
  echo -e "                     Optional argument [hard] will remove all docker images, and won't rebuild"
  echo -e "                     This command will not remove the existing .env configuration file\n"
  echo -e "  -g, --gource       Review git history using gource package"
  echo -e "                     Optional argument [save] to save visualization as a mp4 file\n"


# Provided argument is not supported by this script
else
  echo -e "bc.sh $1 : Invalid argument\n"
  echo -e "\e[31mERROR\e[39m Your argument is invalid"
  echo -e "      Check command help for available arguments: ./bc.sh --help"
fi
