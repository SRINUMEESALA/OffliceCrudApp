# Offline-First CRUD Application

A React Native application that demonstrates offline-first functionality using RxDB with SQLite storage and CouchDB replication. The app allows users to create and manage businesses and articles completely offline, with automatic synchronization when internet connectivity is available.

## Features

- ✅ **Offline-First**: Works completely without internet connection
- ✅ **Auto-Sync**: Automatically synchronizes with CouchDB when online
- ✅ **Business Management**: Create, read, and delete businesses
- ✅ **Article Management**: Create, read, and delete articles linked to businesses
- ✅ **Real-time Updates**: Live data synchronization across devices
- ✅ **Clean UI**: Modern and user-friendly interface
- ✅ **Production Ready**: Built with React Native CLI for production deployment

## Screenshots

<div align="center">
  <img src="https://private-user-images.githubusercontent.com/114816381/489160603-30e8361d-feda-4a59-a648-6c655446738f.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTc3NjQ0NTEsIm5iZiI6MTc1Nzc2NDE1MSwicGF0aCI6Ii8xMTQ4MTYzODEvNDg5MTYwNjAzLTMwZTgzNjFkLWZlZGEtNGE1OS1hNjQ4LTZjNjU1NDQ2NzM4Zi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwOTEzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDkxM1QxMTQ5MTFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT04YzQ4MTA0YmIyYTMzZmM5ZDAwMGEwOWQyNjJjMmM2ODdlYTJkY2FmMTQyZjFhMjk1YzhhN2ZjNjZlYWIxMTJlJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.gIuFGDtVbLoDvrVmlJ7g00ZwKvjq7Cj32mL7DwXgaWU" alt="Home Screen" width="200"/>
  <img src="https://private-user-images.githubusercontent.com/114816381/489160600-a9cd61c4-e7c8-4192-8c82-ec579fabdbc4.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTc3NjQ0NTEsIm5iZiI6MTc1Nzc2NDE1MSwicGF0aCI6Ii8xMTQ4MTYzODEvNDg5MTYwNjAwLWE5Y2Q2MWM0LWU3YzgtNDE5Mi04YzgyLWVjNTc5ZmFiZGJjNC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwOTEzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDkxM1QxMTQ5MTFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1iYTdlZjUwYzQzOWE4ODNiZDA5MjExYWFkZmMzMDc4ZDM4ODNlZGRjYTY1ZjBkMTM1ZmQ5ZDg5NDU5NDY5MWMxJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.m923ZzafE3KEOQbkjwel1IlwTgS2291ZdK8TdNOVaCc" alt="Business List Screen" width="200"/>
  <img src="https://private-user-images.githubusercontent.com/114816381/489160676-a886c7da-4d28-43bc-bb6c-1c3c3652f008.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTc3NjQ1MTEsIm5iZiI6MTc1Nzc2NDIxMSwicGF0aCI6Ii8xMTQ4MTYzODEvNDg5MTYwNjc2LWE4ODZjN2RhLTRkMjgtNDNiYy1iYjZjLTFjM2MzNjUyZjAwOC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwOTEzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDkxM1QxMTUwMTFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0xYTZmMGZhMTU3YTdhOGEyMmM0YjU1ZGNjOWYyNzdlN2VlMjU1YjI3YzhmNDI2OTY4MzFkZTM5YWViY2U0YTdiJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.eV9_G3j9ESafFhafnU6fnt-HqX6nQl7dtAulXxPXXzE" alt="Business Detail Screen" width="200"/>
</div>

_Home Screen | Business List | Business Detail_

## Technology Stack

- **React Native 0.81.4** - Cross-platform mobile development
- **RxDB** - Reactive database with offline-first capabilities
- **SQLite** - Local storage engine via react-native-sqlite-2
- **CouchDB** - Cloud replication server
- **React Navigation** - Navigation between screens
- **TypeScript** - Type-safe development

## Data Models

### Business Model

```json
{
  "id": "string", // Unique ID (generated on frontend)
  "name": "string", // Name of the Business
  "createdAt": "number", // Creation timestamp
  "updatedAt": "number" // Last update timestamp
}
```

### Article Model

```json
{
  "id": "string", // Unique ID (generated on frontend)
  "name": "string", // Article name
  "qty": "number", // Quantity in stock
  "selling_price": "number", // Selling price
  "business_id": "string", // Foreign key to Business
  "createdAt": "number", // Creation timestamp
  "updatedAt": "number" // Last update timestamp
}
```

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- CouchDB (optional, for sync functionality)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd OfflineCRUDApp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **iOS Setup (macOS only)**
   ```bash
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

## Running the Application

### Android

```bash
npx react-native run-android
```

### iOS

```bash
npx react-native run-ios
```

## CouchDB Setup (Optional)

The application works completely offline, but to enable synchronization:

1. **Install CouchDB**

   - Download from [CouchDB official website](https://couchdb.apache.org/)
   - Or use Docker: `docker run -p 5984:5984 couchdb:latest`

2. **Configure CouchDB**

   - Access CouchDB admin panel at `http://localhost:5984/_utils`
   - Create databases: `businesses` and `articles`
   - Set up authentication (username/password)

3. **Update Configuration**
   - Edit `src/services/replication.ts`
   - Update `COUCHDB_URL`, `COUCHDB_USERNAME`, and `COUCHDB_PASSWORD`

## How Offline Functionality Works

### Local Storage

- All data is stored locally using RxDB with SQLite
- No backend API required - everything runs on the frontend
- Data persists between app sessions

### Synchronization

- When online, the app automatically syncs with CouchDB
- Changes are replicated bidirectionally
- Conflict resolution is handled automatically by RxDB
- Works seamlessly when switching between online/offline modes

### Data Flow

1. User creates/updates data → Stored locally in SQLite
2. App detects internet connection → Syncs with CouchDB
3. Other devices receive updates → Local database updated
4. User continues working offline → All changes stored locally

## Project Structure

```
src/
├── database/
│   └── database.ts          # Database configuration and initialization
├── models/
│   ├── Business.ts          # Business data model and schema
│   └── Article.ts           # Article data model and schema
├── services/
│   ├── businessService.ts   # Business CRUD operations
│   ├── articleService.ts    # Article CRUD operations
│   └── replication.ts       # CouchDB replication setup
└── screens/
    ├── HomeScreen.tsx       # Main dashboard
    ├── BusinessListScreen.tsx # List all businesses
    ├── BusinessDetailScreen.tsx # Business details and articles
    ├── CreateBusinessScreen.tsx # Create new business
    └── CreateArticleScreen.tsx # Create new article
```

## Key Features Implementation

### Offline-First Architecture

- RxDB provides automatic offline capabilities
- SQLite ensures data persistence
- No network dependency for core functionality

### Real-time Synchronization

- RxDB CouchDB replication plugin
- Automatic conflict resolution
- Live data updates across devices

### User Experience

- Clean, intuitive interface
- Loading states and error handling
- Pull-to-refresh functionality
- Form validation and feedback

## Building for Production

### Android APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be generated at:
`android/app/build/outputs/apk/release/app-release.apk`

### iOS Archive

```bash
cd ios
xcodebuild -workspace OfflineCRUDApp.xcworkspace -scheme OfflineCRUDApp -configuration Release archive
```

## Testing Offline Functionality

1. **Start the app** with internet connection
2. **Create some data** (businesses and articles)
3. **Turn off internet** (airplane mode or disconnect WiFi)
4. **Continue using the app** - all features work normally
5. **Turn internet back on** - data automatically syncs

## Troubleshooting

### Common Issues

1. **Database initialization fails**

   - Ensure all dependencies are installed
   - Check React Native version compatibility

2. **Sync not working**

   - Verify CouchDB is running and accessible
   - Check network connectivity
   - Review replication configuration

3. **Build errors**
   - Clean and rebuild: `npx react-native clean`
   - Reset Metro cache: `npx react-native start --reset-cache`

### Debug Mode

- Enable RxDB dev mode for detailed logging
- Check console for replication status
- Monitor network requests in development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:

- Check the troubleshooting section
- Review RxDB documentation
- Open an issue in the repository

---

**Note**: This application demonstrates a complete offline-first architecture without requiring any backend API. All data management is handled on the frontend using RxDB, making it perfect for scenarios where network connectivity is unreliable or unavailable.
