# VoxPopStore

## Description

## Table of content
- [Setup Process](#setup-process)
- [Contribute](#contribute)

## Setup Process

### Step-1: Clone GitLab repo for this project locally

You can clone repo locally by git or by downloading the zip file from the GitLab.

**Note:** Make sure you have git installed locally on your computer first. After that run this command.

```sh
git clone https://gitlab.com/voxpopstore/voxpopstore.git
```

### Step-2: CD into the project

You will need to be inside that project file to enter all the rest of the commands. So remember to type **cd projectName** to move your terminal to working directory.

### Step-3: Install NPM Dependencies

To install all the dependencies you need to run this command.

```sh
npm install
```

or if you prefer yarn

```sh
yarn install
```

### Step-4: Setup env variables

Rename `.env.example` file to `.env` or `.env.local`. Then add the config values for the Firebase and Email.JS.

Alternatively following env variables are used. They should be added in your local .env file and in the CI/CD pipeline as well.

```sh
# Firebase App Configs
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_ID=
REACT_APP_FIREBASE_MEASUREMENT=

# React Scripts Config (True or False)
FAST_REFRESH=

# Email.JS Service Configs
REACT_APP_EMAILJS_USER_ID=
REACT_APP_EMAIL_JS_TOKEN=
REACT_APP_EMAILJS_SERVICE_ID=
REACT_APP_EMAILJS_TEMPLATE_ID=

# Link of Live Project
REACT_APP_STORE_LINK=
```

### Step-5: Start your application

To start your application you need to run this command.

```sh
yarn start
```

### Step-6: Run tests

To run tests you need to run this command.

```sh
yarn test
```

### Step-7: Build your application

To build your application for production deployment you need to run this command.

```sh
yarn build
```

### Step-8: Deploy your application to firebase hosting

We are using firebase hosting to host/deploy our application. To do so you need to run the following commands:

#### Step 8.1: Login to firebase

To login to firebase you need to run this command. This is only necessary if you haven't already logged in.

```sh
firebase login
```

#### Step 8.2: Deploy your application to firebase hosting

To deploy your application to firebase hosting you need to run this command.

```sh
firebase deploy --only hosting
```

## Contribute

Clone the repo, create a new branch, add your contribution and start a merge requests once you are ready with your changes.
