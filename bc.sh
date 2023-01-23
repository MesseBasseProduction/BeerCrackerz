#!/bin/bash
vers="0.1.0" # Must match package.json and BeerCrackerz.js version number
basedir=$(dirname "$0")
unset backsecretkey
unset dbuser
unset dbpassword
unset email
unset domain
unset mailjetapi
unset mailjetsecret

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

# User .env variables inputs
updateVariables() {
  while [ -z $backsecretkey ]; do
    read -rp "  1/7. The backend secret key : " backsecretkey
  done
  # Database password (not empty and >4 characters)
  while [ -z $dbuser ]; do
    read -rp "  2/7. The database username : " dbuser
  done
  # Database password (not empty and >4 characters)
  while [[ $dbpassword = "" || ${#dbpassword} -lt 4 ]]; do
    read -rp "  3/7. The database password (> 4 characters) : " dbpassword
  done
  # Database password (not empty and >4 characters)
  while [ -z $email ]; do
    read -rp "  4/7. The administrator email : " email
  done
  # Database password (not empty and >4 characters)
  while [ -z $domain ]; do
    read -rp "  5/7. The production domain (without http/https) : " domain
  done
  # Library path (not empty and an existing directory on system)
  while [ -z $mailjetapi ]; do
    read -rp "  6/7. The MailJet API key : " mailjetapi
  done
  # Resources path (not empty and an existing directory on system)
  while [ -z $mailjetsecret ]; do
    read -rp "  7/7. The MailJet API secret : " mailjetsecret
  done
}

# development .env file creation method
devInstall() {
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
    echo "DB_USER=$2"
    echo "DB_PASSWORD=$3"
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
    echo "BACKEND_SECRET_KEY=$1"
    echo "CSRF_TRUSTED_ORIGINS=http://localhost:8080;http://127.0.0.1:8080"
    echo ""
    echo "# MAILJET"
    echo "MAILJET_API_KEY=$4"
    echo "MAILJET_API_SECRET=$5"
  } >> "$basedir"/.conf/development/conf.env
}

# production .env file creation method
prodInstall() {
  touch "$basedir"/.conf/production/conf.server.env
  { echo "# NGINX"
    echo "NGINX_NAME=beer_crackerz_nginx"
    echo "SERVER_HOST=$5"
    echo "SERVER_HTTP_PORT=80"
    echo "SERVER_HTTPS_PORT=443"
    echo "SERVER_PROTOCOL=https"
    echo "CERTBOT_EMAIL=$4"
    echo "CERT_NAME=beer_crackerz"
    echo "CERTBOT_STAGING=0"
    echo "CERTBOT_LOCAL_CA=0"
    echo ""
    echo "# DATABASE"
    echo "DB_POSTGRES_VERSION=14.2-alpine"
    echo "DB_HOST=beer_crackerz_db"
    echo "DB_PORT=5432"
    echo "DB_NAME=beer_crackerz"
    echo "DB_USER=$2"
    echo "DB_PASSWORD=$3"
    echo ""
    echo "# BACKEND"
    echo "BACKEND_NAME=beer_crackerz_back"
    echo "BACKEND_PORT=8000"
    echo "BACKEND_DEBUG=0"
    echo "BACKEND_ALLOWED_HOSTS=$5"
    echo "BACKEND_USE_EMAIL_FILE_SYSTEM=0"
    echo "BACKEND_SECRET_KEY=$1"
    echo "CSRF_TRUSTED_ORIGINS=https://$5"
    echo ""
    echo "# MAILJET"
    echo "MAILJET_API_KEY=$6"
    echo "MAILJET_API_SECRET=$6"
  } >> "$basedir"/.conf/production/conf.server.env
}

# local production .env file creation method
locprodInstall() {
  touch "$basedir"/.conf/production/conf.local.env
  { echo "# NGINX"
    echo "NGINX_NAME=beer_crackerz_nginx"
    echo "SERVER_HOST=localhost"
    echo "SERVER_HTTP_PORT=80"
    echo "SERVER_HTTPS_PORT=443"
    echo "SERVER_PROTOCOL=https"
    echo "CERTBOT_EMAIL=$4"
    echo "CERT_NAME=beer_crackerz"
    echo "CERTBOT_STAGING=1"
    echo "CERTBOT_LOCAL_CA=1"
    echo ""
    echo "# DATABASE"
    echo "DB_POSTGRES_VERSION=14.2-alpine"
    echo "DB_HOST=beer_crackerz_db"
    echo "DB_PORT=5432"
    echo "DB_NAME=beer_crackerz"
    echo "DB_USER=$2"
    echo "DB_PASSWORD=$3"
    echo ""
    echo "# BACKEND"
    echo "BACKEND_NAME=beer_crackerz_back"
    echo "BACKEND_PORT=8000"
    echo "BACKEND_DEBUG=1"
    echo "BACKEND_ALLOWED_HOSTS=localhost"
    echo "BACKEND_USE_EMAIL_FILE_SYSTEM=1"
    echo "BACKEND_SECRET_KEY=$1"
    echo "CSRF_TRUSTED_ORIGINS=https://localhost;http://127.0.0.1"
    echo ""
    echo "# MAILJET"
    echo "MAILJET_API_KEY=$5"
    echo "MAILJET_API_SECRET=$6"
  } >> "$basedir"/.conf/production/conf.local.env
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

# Initialization sequence, fill .env file to fit user inputs and build docker images in either dev, prod or local prod mode
if [ "$1" = "-i" ] || [ "$1" = "--install" ] || [ "$1" = "i" ] || [ "$1" = "install" ]; then
  echo -e "bc.sh $1 $2 : BeerCrackerz installation\n"
  # Check if all dependencies are installed before doing anything
  for COMMAND in "docker" "docker-compose" "npm"; do
    isInstalled "${COMMAND}"
  done
  # No arguments provided
  if [ -z "$2" ]; then
    echo -e "\e[31mERROR\e[39m Missing [dev/prod/locprod] argument"
    echo -e "      Check command help for available arguments: ./bc.sh --help"
    exit 0
  else
    # Check for previous existing .env files, ensure user want to override existing configuration
    if [[ -f "$basedir"/.conf/development/conf.env || -f "$basedir"/.conf/production/conf.server.env || -f "$basedir"/.conf/production/conf.local.env ]]; then
      echo -e "\e[93mWARNING\e[39m BeerCrackerz has at least on configuration file which might be overriden"
      replaceconf="bc" # Can't init to blank to get in while read loop
      # Wait for user to send yY/nN or blank
      while [[ "$replaceconf" != "" && "$replaceconf" != "y" && "$replaceconf" != "Y" && "$replaceconf" != "n" && "$replaceconf" != "N" ]]; do
        read -rp "        Do you still want to proceed? [y/N] " replaceconf
      done
      # Exit if user didn't enter anything, or entered n/N
      if [ "$replaceconf" = "" ] || [ "$replaceconf" = "n" ] || [ "$replaceconf" = "N" ]; then
        exit 0
      fi
    fi
    # Welcome message
    echo -e "Welcome to the BeerCrackerz installation wizard!"
    echo -e "Before going further, ensure you've read the installation entry of the wiki before going any further"
    echo -e "-> https://github.com/MesseBasseProduction/BeerCrackerz/wiki\n"
    echo -e "Please fill the following information to properly configure BeerCrackerz :\n"
    # Request info from user
    updateVariables
    # Runtime mode to configure
    if [ "$2" = "dev" ]; then
      rm -rf "$basedir"/.conf/development/conf.env
      devInstall "${backsecretkey}" "${dbuser}" "${dbpassword}" "${mailjetapi}" "${mailjetsecret}"
    elif [ "$2" = "prod" ]; then
      rm -rf "$basedir"/.conf/production/conf.server.env
      prodInstall "${backsecretkey}" "${dbuser}" "${dbpassword}" "${email}" "${domain}" "${mailjetapi}" "${mailjetsecret}"
    elif [ "$2" = "locprod" ]; then
      rm -rf "$basedir"/.conf/production/conf.local.env
      locprodInstall "${backsecretkey}" "${dbuser}" "${dbpassword}" "${email}" "${mailjetapi}" "${mailjetsecret}"
    else
      echo -e "\e[31mERROR\e[39m $2 is not a supported argument to build BeerCrackerz"
      echo -e "      Check command help for available arguments: ./bc.sh --help"
      exit 0
    fi
    echo # Line break
    echo -e "\e[32mSUCCESS\e[39m BeerCrackerz installed!"
  fi


# Edit BeerCrackerz configuration
elif [ "$1" = '-e' ] || [ "$1" = '--edit' ] || [ "$1" = 'e' ] || [ "$1" = 'edit' ]; then
  echo -e "bc.sh $1 $2 : BeerCrackerz configuration edit\n"
  # No arguments provided
  if [ -z "$2" ]; then
    echo -e "\e[31mERROR\e[39m Missing [dev/prod/locprod] argument"
    echo -e "      Check command help for available arguments: ./bc.sh --help"
    exit 0
  else
    # Request info from user
    updateVariables
    # Runtime mode to configure
    if [ "$2" = "dev" ]; then
      echo -e "Editing BeerCrackerz configuration in development mode"
      rm -rf "$basedir"/.conf/development/conf.env
      devInstall "${backsecretkey}" "${dbuser}" "${dbpassword}" "${mailjetapi}" "${mailjetsecret}"
    elif [ "$2" = "prod" ]; then
      echo -e "Editing BeerCrackerz in production mode"
      rm -rf "$basedir"/.conf/production/conf.server.env
      prodInstall "${backsecretkey}" "${dbuser}" "${dbpassword}" "${email}" "${domain}" "${mailjetapi}" "${mailjetsecret}"
    elif [ "$2" = "locprod" ]; then
      echo -e "Editing BeerCrackerz in local production mode"
      rm -rf "$basedir"/.conf/production/conf.local.env
      locprodInstall "${backsecretkey}" "${dbuser}" "${dbpassword}" "${email}" "${mailjetapi}" "${mailjetsecret}"
    else
      echo -e "\e[31mERROR\e[39m $2 is not a supported argument to build BeerCrackerz"
      echo -e "      Check command help for available arguments: ./bc.sh --help"
      exit 0
    fi
    echo -e "\e[32mSUCCESS\e[39m BeerCrackerz edited!"
  fi


# Building BeerCrackerz containers in either dev, prod or local prod mode
elif [ "$1" = '-b' ] || [ "$1" = '--build' ] || [ "$1" = 'b' ] || [ "$1" = 'build' ]; then
  echo -e "bc.sh $1 $2 : Build BeerCrackerz\n"
  # No arguments provided
  if [ -z "$2" ]; then
    echo -e "\e[31mERROR\e[39m Missing [dev/prod/locprod] argument"
    echo -e "      Check command help for available arguments: ./bc.sh --help"
    exit 0
  else
    if [ "$2" = "dev" ]; then
      echo -e "Building BeerCrackerz in development mode"
      eval "npm run build"
      eval "docker-compose --file $basedir/docker-compose.yml --env-file $basedir/.conf/development/conf.env build"
    elif [ "$2" = "prod" ]; then
      echo -e "Building BeerCrackerz in production mode"
      eval "npm run build"
      eval "docker-compose --file $basedir/docker-compose.prod.yml --env-file $basedir/.conf/production/conf.server.env build"
    elif [ "$2" = "locprod" ]; then
      echo -e "Building BeerCrackerz in local production mode"
      eval "npm run build"
      eval "docker-compose --file $basedir/docker-compose.prod.yml --env-file $basedir/.conf/production/conf.local.env build"
    else
      echo -e "\e[31mERROR\e[39m $2 is not a supported argument to build BeerCrackerz"
      echo -e "      Check command help for available arguments: ./bc.sh --help"
      exit 0
    fi
    echo -e "\n\e[32mSUCCESS\e[39m BeerCrackerz built!"
  fi


# Start BeerCrackerz application in either dev, prod or local prod mode
elif [ "$1" = '-s' ] || [ "$1" = '--start' ] || [ "$1" = 's' ] || [ "$1" = 'start' ]; then
  echo -e "bc.sh $1 $2 : Start BeerCrackerz application\n"
  # No arguments provided
  if [ -z "$2" ]; then
    echo -e "\e[31mERROR\e[39m Missing [dev/prod/locprod] argument"
    echo -e "      Check command help for available arguments: ./bc.sh --help"
    exit 0
  # Mode was specified by command caller
  else
    if [ "$2" = "dev" ]; then
      echo -e "Starting BeerCrackerz in development mode"
      eval "docker-compose --file $basedir/docker-compose.yml --env-file $basedir/.conf/development/conf.env up -d"
    elif [ "$2" = "prod" ]; then
      echo -e "Starting BeerCrackerz in production mode"
      eval "docker-compose --file $basedir/docker-compose.prod.yml --env-file $basedir/.conf/production/conf.server.env up -d"
    elif [ "$2" = "locprod" ]; then
      echo -e "Starting BeerCrackerz in local production mode"
      eval "docker-compose --file $basedir/docker-compose.prod.yml --env-file $basedir/.conf/production/conf.local.env up -d"
    else
      echo -e "\e[31mERROR\e[39m $2 is not supported as a runtime mode"
      echo -e "      Check command help for available arguments: ./bc.sh --help"
      exit 0
    fi
    echo -e "\n\e[32mSUCCESS\e[39m BeerCrackerz started!"
    echo -e "      If this is the first start, please run the following command when the app is started :"
    echo -e "      $ docker exec -it beer_crackerz_back python manage.py createsuperuser"
  fi


# Start BeerCrackerz application in either dev, prod or local prod mode
elif [ "$1" = '-q' ] || [ "$1" = '--quit' ] || [ "$1" = 'q' ] || [ "$1" = 'quit' ]; then
  echo -e "bc.sh $1 $2 : Quit BeerCrackerz application\n"
  # No arguments provided
  if [ -z "$2" ]; then
    echo -e "\e[31mERROR\e[39m Missing [dev/prod/locprod] argument"
    echo -e "      Check command help for available arguments: ./bc.sh --help"
    exit 0
  # Mode was specified by command caller
  else
    if [ "$2" = "dev" ]; then
      echo -e "Stoping BeerCrackerz containers in development mode"
      eval "docker-compose --file $basedir/docker-compose.yml --env-file $basedir/.conf/development/conf.env down"
    elif [ "$2" = "prod" ]; then
      echo -e "Stoping BeerCrackerz containers in production mode"
      eval "docker-compose --file $basedir/docker-compose.prod.yml --env-file $basedir/.conf/production/conf.server.env down"
    elif [ "$2" = "locprod" ]; then
      echo -e "Stoping BeerCrackerz containers in local production mode"
      eval "docker-compose --file $basedir/docker-compose.prod.yml --env-file $basedir/.conf/production/conf.local.env down"
    else
      echo -e "\e[31mERROR\e[39m $2 is not supported as a runtime mode"
      echo -e "      Check command help for available arguments: ./bc.sh --help"
      exit 0
    fi
    echo -e "\n\e[32mSUCCESS\e[39m BeerCrackerz exited!"
  fi


# Reset BeerCrackerz, clear database files and docker images
elif [ "$1" = "-r" ] || [ "$1" = "--reset" ] || [ "$1" = "r" ] || [ "$1" = "reset" ]; then
  echo -e "bc.sh $1 $2 : Reset BeerCrackerz instance\n"
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
  eval "docker-compose --file $basedir/docker-compose.yml --env-file $basedir/.conf/development/conf.env down -v --rmi all --remove-orphans"
  eval "docker-compose --file $basedir/docker-compose.prod.yml --env-file $basedir/.conf/production/conf.server.env down -v --rmi all --remove-orphans"
  eval "docker-compose --file $basedir/docker-compose.prod.yml --env-file $basedir/.conf/production/conf.local.env down -v --rmi all --remove-orphans"
  echo # Line break
  # Reset hard argument
  if [ "$2" = "hard" ]; then
    echo -e "3/3. Remove all existing docker images\n"
    eval "docker system prune"
    echo -e "\n\e[32mSUCCESS\e[39m BeerCrackerz reseted!"
  # Rebuild the whole thing otherwise
  else
    echo -e "3/3. Complete BeerCrackerz reset"
    echo -e "\n\e[32mSUCCESS\e[39m BeerCrackerz reseted!"
  fi


# Gource version control visualization
elif [ "$1" = '-g' ] || [ "$1" = '--gource' ] || [ "$1" = 'g' ] || [ "$1" = 'gource' ]; then
  echo -e "bc.sh $1 $2 : Gource visualization\n"
  # Check if gource is installed on the system
  isInstalled "gource"
  # Start gource with custom parameters
  gourceOptions="--fullscreen --multi-sampling --auto-skip-seconds 0.1 --seconds-per-day 0.15 --elasticity 0.02 \
           --camera-mode overview --font-size 18 --stop-at-end --bloom-intensity 0.5 --date-format '%d %B %Y' --hide mouse,progress \
           --title 'BeerCrackerz - version $vers, Messe Basse Production 2022/2023' --logo $basedir/static/img/logo-tiny.png --user-image-dir $basedir/static/img/about"
  ffmpegOptions="--output-ppm-stream - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset medium -crf 1 -threads 0 -bf 0 $basedir/bc-git-history.mp4"
  if [ -z "$2" ]; then
    eval "gource $gourceOptions"
  else
    if [ "$2" = 'save' ]; then
      isInstalled "ffmpeg"
      echo -e "Exporting gource visualization as a mp4 file"
      eval "gource $gourceOptions $ffmpegOptions"
    else
      echo -e "\e[31mERROR\e[39m $2 is not supported as an option"
      echo -e "      Check command help for available arguments: ./bc.sh --help"
      exit 0
    fi
  fi


# About BeerCrackerz
elif [ "$1" = '-a' ] || [ "$1" = '--about' ] || [ "$1" = 'a' ] || [ "$1" = 'about' ]; then
  echo -e "bc.sh $1 : About BeerCrackerz\n"


# Command help and usage
elif [ "$1" = '-h' ] || [ "$1" = '--help' ] || [ "$1" = 'h' ] || [ "$1" = 'help' ]; then
  echo -e "bc.sh $1 : Command help\n"
  echo -e "Usage : ./bc.sh [command] [argument]\n"
  echo -e "  -i, --install  [\e[33mdev\e[39m/\e[33mprod\e[39m/\e[33mlocprod\e[39m] – \e[33mMandatory\e[39m"
  echo -e "                     Configure environment file and install BeerCrackerz on the system\n"
  echo -e "  -e, --edit     [\e[33mdev\e[39m/\e[33mprod\e[39m/\e[33mlocprod\e[39m] – \e[33mMandatory\e[39m"
  echo -e "                     Edit the environment file\n"
  echo -e "  -b, --build    [\e[33mdev\e[39m/\e[33mprod\e[39m/\e[33mlocprod\e[39m] – \e[33mMandatory\e[39m"
  echo -e "                     Build the docker containers\n"
  echo -e "  -s, --start    [\e[33mdev\e[39m/\e[33mprod\e[39m/\e[33mlocprod\e[39m] – \e[33mMandatory\e[39m"
  echo -e "                     Start BeerCrackerz application\n"
  echo -e "  -q, --quit     [\e[33mdev\e[39m/\e[33mprod\e[39m/\e[33mlocprod\e[39m] – \e[33mMandatory\e[39m"
  echo -e "                     Stop any running BeerCrackerz application\n"
  echo -e "  -r, --reset    [\e[32mhard\e[39m] – \e[32mOptional\e[39m"
  echo -e "                     Remove existing database and docker images, hard argument will docker prune"
  echo -e "                     This command will not remove any .env configuration files\n"
  echo -e "  -g, --gource   [\e[32msave\e[39m] – \e[32mOptional\e[39m"
  echo -e "                     Review git history using gource, save argument to save output as mp4 in ./\n"
  echo -e "  -a, --about    Information about BeerCrackerz project"
  echo -e "  -h, --help     Display command usage\n"


# Provided argument is not supported by this script
else
  echo -e "bc.sh $1 : Invalid argument\n"
  echo -e "\e[31mERROR\e[39m Your argument is invalid"
  echo -e "      Check command help for available arguments: ./bc.sh --help"
fi