#!/usr/bin/env bash
vers="0.1.0" # Must match package.json and BeerCrackerz.js version number
basedir=$(dirname "${0}")
unset backsecretkey
unset dbuser
unset dbpassword
unset serverurl
unset mailjetapi
unset mailjetsecret

# Method to display Command help and usage

function usage(){
  echo -e "bc.sh ${1} : Command help\n"
  echo -e "Usage : ./bc.sh [command] [argument]\n"
  echo -e "  -i, i, --install, install  [\e[33mdev\e[39m/\e[33mprod\e[39m/\e[33mpreprod\e[39m] – \e[33mMandatory\e[39m"
  echo -e "                               Configure environment file and install BeerCrackerz on the system\n"
  echo -e "  -e, e, --edit, edit        [\e[33mdev\e[39m/\e[33mprod\e[39m/\e[33mpreprod\e[39m] – \e[33mMandatory\e[39m"
  echo -e "                               Edit the environment file\n"
  echo -e "  -b, b, --build, build      [\e[33mdev\e[39m/\e[33mprod\e[39m/\e[33mpreprod\e[39m] – \e[33mMandatory\e[39m"
  echo -e "                               Build the docker containers\n"
  echo -e "  -s, s, --start, start      [\e[33mdev\e[39m/\e[33mprod\e[39m/\e[33mpreprod\e[39m] – \e[33mMandatory\e[39m"
  echo -e "                               Start BeerCrackerz application\n"
  echo -e "  -u, u, --update, update    [\e[33mdev\e[39m/\e[33mprod\e[39m/\e[33mpreprod\e[39m] – \e[33mMandatory\e[39m"
  echo -e "                               Quit, pull, build and start aplication\n"
  echo -e "  -q, q, --quit, quit        [\e[33mdev\e[39m/\e[33mprod\e[39m/\e[33mpreprod\e[39m] – \e[33mMandatory\e[39m"
  echo -e "                               Stop any running BeerCrackerz application\n"
  echo -e "  -r, r, --reset, reset      [\e[32mhard\e[39m] – \e[32mOptional\e[39m"
  echo -e "                               Remove existing database and docker images, hard argument will docker prune"
  echo -e "                               This command will not remove any .env configuration files\n"
  echo -e "  -g, g, --gource, gource    [\e[32msave\e[39m] – \e[32mOptional\e[39m"
  echo -e "                               Review git history using gource, save argument to save output as mp4 in ./\n"
  echo -e "  -a, a, --about, about      Information about BeerCrackerz project\n"
  echo -e "  -h, h, --help, help        Display command usage\n"
}

# Method to check if given command is installed on the system
isInstalled() {
  command -v "${1}" >/dev/null 2>&1
  if [[ $? -ne 0 ]]; then
    echo -e "\e[31mERROR\e[39m ${1} is not installed on the system"
    echo -e "      Ensure docker, docker-compose and npm are installed"
    echo -e "      On a production environment, nginx must be installed as well"
    echo -e "      -> https://github.com/MesseBasseProduction/BeerCrackerz/wiki"
    exit 0
  fi
}

# User .env variables inputs
updateVariables() {
  while [ -z ${backsecretkey} ]; do
    read -rp "  1/7. The backend secret key : " backsecretkey
  done
  # Database user
  while [ -z ${dbuser} ]; do
    read -rp "  2/7. The database username : " dbuser
  done
  # Database password (not empty and >10 characters)
  while [[ ${dbpassword} = "" || ${#dbpassword} -lt 10 ]]; do
    read -rp "  3/7. The database password (> 10 characters) : " dbpassword
  done
  # Server url with protocol
  while [ -z ${serverurl} ]; do
    read -rp "  5/7. The production server url: " serverurl
  done
  # Mailjet API key
  while [ -z ${mailjetapi} ]; do
    read -rp "  6/7. The MailJet API key : " mailjetapi
  done
  # Mailjet API secret
  while [ -z ${mailjetsecret} ]; do
    read -rp "  7/7. The MailJet API secret : " mailjetsecret
  done
}

# development .env file creation method
devInstall() {
  touch "${basedir}"/.conf/development/conf.env
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
    echo "DB_USER=${2}"
    echo "DB_PASSWORD=${3}"
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
    echo "BACKEND_SECRET_KEY=${1}"
    echo "CSRF_TRUSTED_ORIGINS=http://localhost:8080;http://127.0.0.1:8080"
    echo ""
    echo "# MAILJET"
    echo "MAILJET_API_KEY=${4}"
    echo "MAILJET_API_SECRET=${5}"
  } >> "${basedir}"/.conf/development/conf.env
}

# production .env file creation method
prodInstall() {
  touch "${basedir}"/.conf/production/conf.env
  { echo "# PROJECT"
    echo "PROJECT_NAME=beer_crackerz"
    echo ""
    echo "# NGINX"
    echo "NGINX_NAME=beer_crackerz_nginx"
    echo "SERVER_HOST=127.0.0.1"
    echo "SERVER_PORT=8000"
    echo "SERVER_URL=${4}"
    echo ""
    echo "# DATABASE"
    echo "DB_POSTGRES_VERSION=14.2-alpine"
    echo "DB_HOST=beer_crackerz_db"
    echo "DB_PORT=5432"
    echo "DB_NAME=beer_crackerz"
    echo "DB_USER=${2}"
    echo "DB_PASSWORD=${3}"
    echo ""
    echo "# BACKEND"
    echo "BACKEND_NAME=beer_crackerz_back"
    echo "BACKEND_PORT=8000"
    echo "BACKEND_DEBUG=0"
    echo "BACKEND_ALLOWED_HOSTS=127.0.0.1"
    echo "BACKEND_USE_EMAIL_FILE_SYSTEM=0"
    echo "BACKEND_SECRET_KEY=${1}"
    echo "CSRF_TRUSTED_ORIGINS=${4}"
    echo ""
    echo "# MAILJET"
    echo "MAILJET_API_KEY=${5}"
    echo "MAILJET_API_SECRET=${6}"
    echo ""
    echo "# VOLUMES"
    echo "VOLUME_DB=bc_db"
    echo "VOLUME_STATIC_FILES=bc_static_files"
    echo "VOLUME_MEDIA=bc_media"
    echo "VOLUME_LOGS=bc_logs"
  } >> "${basedir}"/.conf/production/conf.env
}

# preprod .env file creation method. The preprod use the production configuration
preprodInstall() {
  touch "${basedir}"/.conf/production/conf.env
  { echo "# PROJECT"
    echo "PROJECT_NAME=beer_crackerz_preprod"
    echo ""
    echo "# NGINX"
    echo "NGINX_NAME=beer_crackerz_nginx_preprod"
    echo "SERVER_HOST=127.0.0.1"
    echo "SERVER_PORT=7000"
    echo "SERVER_URL=${4}"
    echo ""
    echo "# DATABASE"
    echo "DB_POSTGRES_VERSION=14.2-alpine"
    echo "DB_HOST=beer_crackerz_db_preprod"
    echo "DB_PORT=7001"
    echo "DB_NAME=beer_crackerz"
    echo "DB_USER=${2}"
    echo "DB_PASSWORD=${3}"
    echo ""
    echo "# BACKEND"
    echo "BACKEND_NAME=beer_crackerz_back_preprod"
    echo "BACKEND_PORT=7000"
    echo "BACKEND_DEBUG=1"
    echo "BACKEND_ALLOWED_HOSTS=127.0.0.1"
    echo "BACKEND_USE_EMAIL_FILE_SYSTEM=1"
    echo "BACKEND_SECRET_KEY=${1}"
    echo "CSRF_TRUSTED_ORIGINS=${4}"
    echo ""
    echo "# MAILJET"
    echo "MAILJET_API_KEY=${5}"
    echo "MAILJET_API_SECRET=${6}"
    echo ""
    echo "# VOLUMES"
    echo "VOLUME_DB=bc_db_preprod"
    echo "VOLUME_STATIC_FILES=bc_static_files_preprod"
    echo "VOLUME_MEDIA=bc_media_preprod"
    echo "VOLUME_LOGS=bc_logs_preprod"
  } >> "${basedir}"/.conf/production/conf.env
}

function createConfFile() {
  # Initialization sequence, fill .env file to fit user inputs and build docker images in either dev, prod or local prod mode
  # Check if all dependencies are installed before doing anything
  for COMMAND in "docker" "docker-compose" "npm"; do
    isInstalled "${COMMAND}"
  done
  
  #  # Check for previous existing .env files, ensure user want to override existing configuration
    if [[ -f "${basedir}"/.conf/development/conf.env || -f "${basedir}"/.conf/production/conf.env ]]; then
      echo -e "\e[93mWARNING\e[39m BeerCrackerz has at least one configuration file which might be overriden"
      # Can't init to blank to get in while read loop
      replaceconf="bc"
      # Wait for user to send yY/nN or blank
      while [[ "${replaceconf}" != "" && "${replaceconf}" != "y" && "${replaceconf}" != "Y" && "${replaceconf}" != "n" && "${replaceconf}" != "N" ]]; do
        read -rp "        Do you still want to proceed? [y/N] " replaceconf
      done
      # Exit if user didn't enter anything, or entered n/N
      if [ "${replaceconf}" = "" ] || [ "${replaceconf}" = "n" ] || [ "${replaceconf}" = "N" ]; then
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
    if [ "${1}" = "dev" ]; then
      rm -rf "${basedir}"/.conf/development/conf.env
      echo "Creating configuration file for development environment."
      devInstall "${backsecretkey}" "${dbuser}" "${dbpassword}" "${mailjetapi}" "${mailjetsecret}"
    elif [ "${1}" = "prod" ]; then
      rm -rf "${basedir}"/.conf/production/conf.env
      echo "Creating configuration file for production environment."
      prodInstall "${backsecretkey}" "${dbuser}" "${dbpassword}" "${serverurl}" "${mailjetapi}" "${mailjetsecret}"
    elif [ "${1}" = "preprod" ]; then
      rm -rf "${basedir}"/.conf/production/conf.env
      echo "Creating configuration file for preprod environment."
      preprodInstall "${backsecretkey}" "${dbuser}" "${dbpassword}" "${serverurl}" "${mailjetapi}" "${mailjetsecret}"
    fi
    echo # Line break
    echo -e "\e[32mSUCCESS\e[39m BeerCrackerz installed!"

}

function editConfFile() {
  # Runtime mode to configure
  if [ ${1} == "prod" ] || [ ${1} == "preprod" ]; then
		confFile=$(echo $(pwd)/.conf/production/conf.env)
	else
		confFile=$(echo $(pwd)/.conf/development/conf.env)
	fi
	echo -e "You are going to modify \033[38;5;226m${confFile}\033[00m"
	# Looping over all terms that will need to be updated in file
	for envVar in "DB_USER" "DB_PASSWORD" "BACKEND_SECRET_KEY" "MAILJET_API_KEY" "MAILJET_API_SECRET" "CSRF_TRUSTED_ORIGINS" "SERVER_URL"; do
		# Get whole line matching current envVar which need an update
		tmp=$(grep ${envVar} ${confFile})
		# Check if current envVar exists in file
		# if yes, then update it or not
		if [ $? -eq 0 ]; then
			# Printing current value in file
			echo "Currently ${tmp}"
			# Can't start looping with an empty variable
			replaceVar="bc"
			while [[ ${replaceVar} != "" && ${replaceVar} != "y" && "${replaceVar}" != "Y" && "${replaceVar}" != "n" && "${replaceVar}" != "N" ]]; do
				read -rp "	Do you want to replace ${envVar} current value ? [y/n] " replaceVar
			done
			# If var needs to be replaced then replace it
			# Else continue to next var
			if [[ ${replaceVar} == "y" || ${replaceVar} == "Y" ]]; then
				read -rp "	${envVar} = " replaceVar
				sed -i -e "s/${tmp}/${envVar}=${replaceVar}/g" ${confFile}
			fi
    fi
	done

  echo -e "\e[32mSUCCESS\e[39m BeerCrackerz edited!"
}

function buildApp(){
  if [ "${1}" = "dev" ]; then
    echo -e "Building BeerCrackerz for development environment"
    eval "npm run build"
    eval "docker-compose --file ${basedir}/docker-compose.yml --env-file ${basedir}/.conf/development/conf.env build"
  elif [ "${1}" = "prod" ] || [ ${1} == "preprod" ]; then
    echo -e "Building BeerCrackerz for ${1} environment"
    eval "npm run build"
    eval "docker-compose --file ${basedir}/docker-compose.prod.yml --env-file ${basedir}/.conf/production/conf.env build"
  fi

  echo -e "\n\e[32mSUCCESS\e[39m BeerCrackerz built!"
}

function startApp(){
  if [ "${1}" = "dev" ]; then
    echo -e "Starting BeerCrackerz in development environment"
    eval "docker-compose --file ${basedir}/docker-compose.yml --env-file ${basedir}/.conf/development/conf.env up -d"
  elif [ "${1}" = "prod" ] || [ ${1} == "preprod" ]; then
    echo -e "Starting BeerCrackerz in ${1} environment"
    eval "docker-compose --file ${basedir}/docker-compose.prod.yml --env-file ${basedir}/.conf/production/conf.env up -d"
  fi

  echo -e "\n\e[32mSUCCESS\e[39m BeerCrackerz started!"
  echo -e "      If this is the first start, please run the following command when the app is started :"
  echo -e "      $ docker exec -it beer_crackerz_back python manage.py createsuperuser"
}

function quitApp(){
  if [ "${1}" = "dev" ]; then
    echo -e "Stoping BeerCrackerz containers in development environment"
    eval "docker-compose --file ${basedir}/docker-compose.yml --env-file ${basedir}/.conf/development/conf.env down"
  elif [ "${1}" = "prod" ] || [ ${1} == "preprod" ]; then
    echo -e "Stoping BeerCrackerz containers in ${1} environment"
    eval "docker-compose --file ${basedir}/docker-compose.prod.yml --env-file ${basedir}/.conf/production/conf.env down"
  fi

  echo -e "\n\e[32mSUCCESS\e[39m BeerCrackerz exited!"
}

function resetApp(){
  # Reset BeerCrackerz, clear database files and docker images
  # Warn user that the command will remove database and images
  echo -e "\e[93mWARNING\e[39m This command will erase any existing BeerCrackerz' docker images"
  resetBc="bc" # Can't init to blank to get in while read loop
  # Wait for user to send yY/nN or blank
  while [[ "${resetBc}" != "" && "${resetBc}" != "y" && "${resetBc}" != "Y" && "${resetBc}" != "n" && "${resetBc}" != "N" ]]; do
    read -rp "        Do you want to fully reset BeerCrackerz? [y/N] " resetBc
  done
  # Exit if user didn't enter anything, or entered n/N
  if [ "${resetBc}" = "" ] || [ "${resetBc}" = "n" ] || [ "${resetBc}" = "N" ]; then
    exit 0
  fi
  # Ensure all docker are stopped
  echo # Line break
  echo -e "1/3. Stopping any BeerCrackerz containers"
  eval "docker-compose stop"
  echo # Line break
  # Remove BeerCrackerz's related dockers
  echo -e "2/3. Removing BeerCrackerz containers"
  eval "docker-compose --file ${basedir}/docker-compose.yml --env-file ${basedir}/.conf/development/conf.env down --rmi all --remove-orphans"
  eval "docker-compose --file ${basedir}/docker-compose.prod.yml --env-file ${basedir}/.conf/production/conf.env down  --rmi all --remove-orphans"
  echo # Line break
  # Reset hard argument
  if [ "${1}" = "hard" ]; then
    echo -e "3/3. Remove all existing docker images\n"
    eval "docker system prune"
    echo -e "\n\e[32mSUCCESS\e[39m BeerCrackerz reset!"
  # Rebuild the whole thing otherwise
  else
    echo -e "3/3. Complete BeerCrackerz reset"
    echo -e "\n\e[32mSUCCESS\e[39m BeerCrackerz reset!"
  fi
}

function gourceControl(){
  # Check if gource is installed on the system
  isInstalled "gource"
  # Start gource with custom parameters
  gourceOptions="--fullscreen --multi-sampling --auto-skip-seconds 0.1 --seconds-per-day 0.15 --elasticity 0.02 \
           --camera-mode overview --font-size 18 --stop-at-end --bloom-intensity 0.5 --date-format '%d %B %Y' --hide mouse,progress \
           --title 'BeerCrackerz - version ${vers}, Messe Basse Production 2022/2023' --logo ${basedir}/static/img/logo-tiny.png --user-image-dir ${basedir}/static/img/about"
  ffmpegOptions="--output-ppm-stream - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset medium -crf 1 -threads 0 -bf 0 ${basedir}/bc-git-history.mp4"
  if [ "$1" = 'save' ]; then
    isInstalled "ffmpeg"
    echo -e "Exporting gource visualization as a mp4 file"
    eval "gource $gourceOptions $ffmpegOptions"
  fi
}

function updateApp(){
  echo -e "Start updating BeerCrackerz!"
  quitApp ${1}
  buildApp ${1}
  startApp ${1}

  echo -e "\e[32mSUCCESS\e[39m BeerCrackerz updated!"
}

# Script header
echo # Line break
echo -e "  ## ---------------------------------- ##"
echo -e "  ##            \e[92mBeerCrackerz\e[39m            ##"
echo -e "  ##        2022/2023 -- GPL-3.0        ##"
echo -e "  ##               v${vers}               ##"
echo -e "  ## ---------------------------------- ##"
echo # Line break

# First of all, test if user has send an argument
if [ $# -eq 0 ]; then
  echo -e "bc.sh : Missing argument\n"
  echo -e "\e[31mERROR\e[39m Command executed without any arguments"
  echo -e "      Check command help for available arguments: ./bc.sh --help"
  exit 1
fi

for option in ${@}
do
  case "${1}" in 
    -h|h|--help|help)
      usage
      exit 0
    ;;
    -i|i|--install|install)
      if [[ ! ${2} == @(dev|prod|preprod) ]]; then
        echo -e "\e[31mERROR\e[39m \"${2}\" is not a supported argument to create BeerCrackerz configuration file."
        echo -e "      Check command help for available arguments: ./bc.sh --help"
        exit 1
      fi
      createConfFile ${2}
      shift
    ;;
    -e|e|--edit|edit)
      if [[ ! ${2} == @(dev|prod|preprod) ]]; then
        echo -e "\e[31mERROR\e[39m \"${2}\" is not a supported argument to edit BeerCrackerz configuration file."
        echo -e "      Check command help for available arguments: ./bc.sh --help"
        exit 1
      fi
      editConfFile ${2}
      shift
    ;;
    -b|b|--build|build)
      if [[ ! ${2} == @(dev|prod|preprod) ]]; then
        echo -e "\e[31mERROR\e[39m \"${2}\" is not a supported argument to build BeerCrackerz."
        echo -e "      Check command help for available arguments: ./bc.sh --help"
        exit 1
      fi
      buildApp ${2}
      shift
    ;;
    -s|s|--start|start)
      if [[ ! ${2} == @(dev|prod|preprod) ]]; then
        echo -e "\e[31mERROR\e[39m \"${2}\" is not a supported argument to start BeerCrackerz."
        echo -e "      Check command help for available arguments: ./bc.sh --help"
        exit 1
      fi
      startApp ${2}
      shift
    ;;
    -u|u|--update|update)
      if [[ ! ${2} == @(dev|prod|preprod) ]]; then
        echo -e "\e[31mERROR\e[39m \"${2}\" is not a supported argument to update BeerCrackerz."
        echo -e "      Check command help for available arguments: ./bc.sh --help"
        exit 1
      fi
      updateApp ${2}
      exit 0
    ;;
    -q|q|--quit|quit)
      if [[ ! ${2} == @(dev|prod|preprod) ]]; then
        echo -e "\e[31mERROR\e[39m \"${2}\" is not a supported argument to stop BeerCrackerz."
        echo -e "      Check command help for available arguments: ./bc.sh --help"
        exit 1
      fi
      quitApp ${2}
      shift
    ;;
    -r|r|--reset|reset)
      if [[ ${2} =~ ^\- ]]; then
        resetApp
      elif [[ ! ${2} == @("hard"|"") ]]; then
        echo -e "\e[31mERROR\e[39m \"${2}\" is not a supported argument to reset BeerCrackerz."
        echo -e "      Check command help for available arguments: ./bc.sh --help"
        exit 1
      else
        resetApp ${2}
        shift
      fi
    ;;
    -g|g|--gource|gource)
      if [[ ! ${2} == @("save"|"") ]]; then
        echo -e "\e[31mERROR\e[39m \"${2}\" is not a supported argument to use with gource."
        echo -e "      Check command help for available arguments: ./bc.sh --help"
        exit 1
      fi
      gourceControl ${2}
      shift
    ;;
    -a|a|--about|about)
      echo -e "bc.sh ${1} : About BeerCrackerz\nWelcome, fellow beer lovers.\nBeerCrackerz is a community web app to list the best spots to drink a fresh one while you're outside.\nIt provides a well-known map interface so it is really easy to browse, find or add unique spots!"
      exit 0
    ;;
    "")
      exit 0
    ;;
    *)
      echo -e "\e[31mERROR\e[39m Invalid '${1}' option. See ${0} --help"
      exit 1
    ;;
  esac
  shift
done
