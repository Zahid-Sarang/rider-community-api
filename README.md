# Online Prescription Platform

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Overview
The Online Prescription Platform allows patients to connect with doctors seamlessly. Patients can sign up, view a list of doctors, and consult with them through a user-friendly interface. Doctors can sign up, provide their details, and offer consultations to patients.

## Features
- **Doctor Sign-up/Sign-in**: Profile picture, name, specialty, email (unique), phone number (unique), and years of experience.
- **Patient Sign-up/Sign-in**: Profile picture, name, age, email (unique), phone number (unique), history of surgery, and history of illness.
- **Doctors List View**: Patients can view a list of doctors in a grid format with profile images, names, specialties, and a consult button.
- **Consultation Form**: After clicking on the consult button, patients are directed to the respective doctor's consultation form.
- **JWT Authentication**: Secure authentication using JWT tokens with access and refresh token mechanisms.
- **Image Storage**: Images are stored using AWS S3.

## Tech Stack
- **Frontend**: 
  - Vite
  - React
  - TypeScript
  - Ant Design
- **Backend**: 
  - Node.js
  - Express.js
  - TypeScript
- **Database**:
  - MongoDB
  - AWS S3 for image storage
- **Authentication**: 
  - JWT tokens (access and refresh tokens)
- **Principles**: 
  - SOLID principles

## Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/online-prescription-platform.git
    cd online-prescription-platform
    ```

2. Install dependencies for both frontend and backend:
    ```bash
    # For frontend
    cd frontend
    npm install

    # For backend
    cd ../backend
    npm install
    ```

3. Configure environment variables:
    - Create a `.env` file in the `backend` directory and add the following variables:
      ```env
      MONGO_URI=your_mongodb_uri
      JWT_SECRET=your_jwt_secret
      AWS_ACCESS_KEY_ID=your_aws_access_key_id
      AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
      S3_BUCKET_NAME=your_s3_bucket_name
      ```

4. Start the development servers:
    ```bash
    # Start backend
    cd backend
    npm run dev

    # Start frontend
    cd ../frontend
    npm run dev
    ```

## Usage
1. Access the application through the following URLs:
    - **Doctor Sign-up/Sign-in**: `/doctor-signup` and `/doctor-signin`
    - **Patient Sign-up/Sign-in**: `/patient-signup` and `/patient-signin`
2. Doctors can sign up by providing their details and log in using their credentials.
3. Patients can sign up by providing their details and log in using their credentials.
4. Patients can view the list of doctors and consult with them by clicking the consult button on the doctor's card.


## API Endpoints
### Authentication
- **Register User** (Doctor/Patient)
  - `POST /api/v1/auth/register`
  - Request: Multipart/form-data
  - Body:
    ```json
    {
      "profilePicture": "file",
      "name": "string",
      "specialty": "string", // for doctors
      "email": "string",
      "phone": "string",
      "yearsOfExperience": "number", // for doctors
      "age": "number", // for patients
      "historyOfSurgery": "string", // for patients
      "historyOfIllness": "string" // for patients
    }
    ```
- **Login User**
  - `POST /api/v1/auth/login`
  - Request: JSON
  - Body:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

- **Get Self**
  - `GET /api/v1/auth/self`
  - Request: Header
    - `Authorization: Bearer <access_token>`

- **Refresh Token**
  - `POST /api/v1/auth/refresh`
  - Request: JSON
  - Body:
    ```json
    {
      "refreshToken": "string"
    }
    ```

- **Get Doctors List**
  - `GET /api/v1/auth/getDoctors`
  - Request: Header
    - `Authorization: Bearer <access_token>`
    - Access Control: Patient

- **Logout User**
  - `POST /api/v1/auth/logout`
  - Request: Header
    - `Authorization: Bearer <access_token>`
  - Body:
    ```json
    {
      "refreshToken": "string"
    }
    ```

### Consultation
- **Create Consultation**
  - `POST /api/v1/consultation`
  - Request: JSON
  - Body:
    ```json
    {
      "patientId": "string",
      "doctorId": "string",
      "description": "string",
      "date": "string"
    }
    ```
  - Header
    - `Authorization: Bearer <access_token>`



