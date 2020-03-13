#https://sosa.net app!

I'm a work in progress, ignore me or don't. I'm just a readme not your boss!

```
npm config set "@fortawesome:registry" https://npm.fontawesome.com/ && \
npm config set "//npm.fontawesome.com/:_authToken" [YOUR_KEY]
npm install
```

If you're using App Center rename
`android/app/src/main/assets/appcenter-config.example.json`
to
`android/app/src/main/assets/appcenter-config.json`

and set your app secret!

Run Tests: 
`npm test`

#Android

Run: 
`npx react-native run-android`

Build APK: `./gradlew assemble`

##Sign APK
If you don't have a keystore

`keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias`

If you don't have an environment variable with the keystore pass already set it with

`export SOSA_KEYSTORE_PASS=yourpassword`

Finally
```
zipalign -v -p 4 ./app/build/outputs/apk/release/app-release-unsigned.apk ./app/build/outputs/apk/release/app-release-unsigned-aligned.apk
apksigner sign --ks-pass env:SOSA_KEYSTORE_PASS --ks /path/to/my-release-key.jks --out ./app/build/outputs/apk/release/app-release.apk ./app/build/outputs/apk/release/app-release-unsigned-aligned.apk
apksigner verify ./app/build/outputs/apk/release/app-release.apk
```

You might get some errors for verify about various XML files, you don't need to worry about these

#iOS

Run: 
```
cd ios; pod install; cd ..
npx react-native run-ios
```

##Build
First you'll need to do a build, archive and distribute an IPA in XCode, this has been required since xcode 9 and will generate a folder which has a file called "ExportOptions.plist"

```
xcodebuild -workspace SoSa.xcworkspace -scheme SoSa clean archive -configuration release -sdk iphoneos -archivePath SoSa.xcarchive
xcodebuild -archivePath SoSa.xcarchive -exportPath /path/to/export/to/SoSa.ipa -exportOptionsPlist /path/to/ExportOptions.plist -exportArchive
```


