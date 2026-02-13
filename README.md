> **_NOTE:_** This project is actively being developed. Some features may not be fully functional, and UI/UX improvements are ongoing.

# Camagru
Camagru is a modern social media web application that allows users to share, interact, and engage with photos in a secure and fun way. It’s designed to provide a smooth and responsive user experience across all devices. Users can easily capture moments using their webcam or upload images, interact with others via likes and comments, and manage their own profiles.

## 🚀 Description
Key highlights include:

* **User-friendly interface:** Intuitive design for quick navigation and interaction.
* **Interactive social features:** Like, comment, and bookmark posts seamlessly.
* **Profile and content management:** Users can upload photos or take webcam shots, use simple photot filters, edit posts, update profiles, and share content via QR codes.
* **Real-time user search:** Quickly find and follow other users.
* **Customizable experience:** Dark mode for comfortable browsing at any time.
* **Secure and reliable:** Email-verified authentication ensures user safety.


## 🛠 Technologies

**Backend and frontend:** Next.js + TypeScript

**Database:** Prisma + MySQL via supabase

**Tests:** Jest + Playwright

## 🚀 Key Features
### 🔐 Authentication
The application implements a secure and production-style authentication system:
- **Password Security**: All passwords hashed with bcrypt (12 salt rounds)
- **Email Verification**: Required before account activation
- **Session Management**: JWT-based sessions via NextAuth.js
- **Client-side session checks** to redirect unauthenticated users
- **Password Requirements**: Minimum 8 characters, uppercase, lowercase, number, and symbol
<img width="1437" height="747" alt="image" src="https://github.com/user-attachments/assets/2c4a4340-e029-48eb-845b-0222dd924ecc" />

### 👤 User Profile
<img width="1437" height="752" alt="image" src="https://github.com/user-attachments/assets/8a54a59b-27b1-4130-9d60-e9d2c7ff9beb" />

### 📷 Post Modal
Provides advanced post management and social interactions:

- Like, unlike, and bookmark posts with optimistic UI updates
- Inline caption editing (available only to post owner) with smart truncation and validation
- Secure post deletion with cascade removal of all associated likes and comments
<img width="1439" height="753" alt="image" src="https://github.com/user-attachments/assets/9149879f-eb4c-4080-8ba9-9c037ef029d9" />

### Post Creation System
Users can create and publish posts with built-in validation, media processing, and interactive UI enhancements.

- Live image preview before publishing  
- Auto-resizing caption textarea  
- Caption validation (length limit + sanitization)  
- Disabled publish button until all validations pass  
- Image filters  

<table>
  <tr>
<td width="50%" valign="top">
<img src="https://github.com/user-attachments/assets/2270666d-65dc-4115-beaa-5017c7e92963" width="100%" />
  </td>

<td width="50%" align="center">
<img width="1440" height="686" alt="image" src="https://github.com/user-attachments/assets/4658e8d6-33e6-4452-8bdd-0574e75c94fa" />
  </td>
</tr>
</table>

### 🔎 Search bar with search history
<img width="960" height="316" alt="image" src="https://github.com/user-attachments/assets/170ef07e-11ca-4ec6-aed9-bc24d5ad3254" />



Live demo video: https://github.com/user-attachments/assets/f1107567-b6fc-494c-9c03-4073f10b18a9




### 📦 Installation
1. Clone this git repository:

``` bash
https://github.com/vkuznets23/camagru
cd camagruApp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
``` bash
# Create a .env file

DATABASE_URL="postgresql://USERNAME@localhost:****/db_name"
AUTH_SECRET="SECRET"
NEXTAUTH_URL="http://localhost:****"

EMAIL_SERVER_HOST="sandbox.smtp.mailtrap.io"
EMAIL_SERVER_PORT=****
EMAIL_SERVER_USER="SERVER_USER"
EMAIL_SERVER_PASSWORD="SERVER_PASSWORD" 
EMAIL_FROM="noreply@yourdomain.com"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME='CLOUD_NAME'
NEXT_PUBLIC_CLOUDINARY_UPLOADPRESET='CLOUDINARY_UPLOADPRESET'
CLOUDINARY_API_KEY='API_KEY'
CLOUDINARY_API_SECRET='API_SECRET'
```

4. Run the development server:
```bash
npm run dev
```




