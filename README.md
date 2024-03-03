# HokkienTranslation Setup Guide

This guide provides instructions on how to set up and deploy the `HokkienTranslation` project.

## Prerequisites

Before you begin, make sure that `npm` and `expo-cli` is installed on your system. If you do not have `npm`, please install it from [npm's official website](https://www.npmjs.com/get-npm).
If you do not have `expo-cli` run the following command to install:
    ```
    npm install -g expo-cli
    ```

## Installation

1. Navigate to the `HokkienTranslation` project directory.
2. Run the following command to install all necessary dependencies:

   ```
   npm install
   ```

## Running the Project

- To start the project on your local machine, run:

  ```
  npm run start
  ```

- To run the project in a web environment, use:

  ```
  npm run web
  ```

## Deployment

To deploy the `HokkienTranslation` project to Vercel, follow these steps:

1. Build the project for production by running:

   ```
   expo-cli build:web
   ```
   
2. Navigate to the web-build folder:

   ```
   cd web-build
   ```
   
3. Deploy the build to Vercel using the `vercel` command:

   ```
   vercel
   ```

For more detailed information on publishing websites, refer to the [Expo documentation on publishing websites](https://docs.expo.dev/distribution/publishing-websites/).
