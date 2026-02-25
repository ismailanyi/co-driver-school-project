{ pkgs ? import <nixpkgs> { config = { 
  allowUnfree = true;
  android_sdk.accept_license = true;
   }; } }:

let 
  androidSdk = pkgs.androidenv.composeAndroidPackages {
    cmdLineToolsVersion = "13.0";
    # toolsVersion ? "latest",
    platformToolsVersion = "35.0.1";
    buildToolsVersions = [ "36.0.0" ];
    platformVersions = [ "36" ];

    includeNDK = true;
    ndkVersions = [ "27.1.12297006"];
    includeEmulator = false;
    includeSystemImages = false;
  };

in
  pkgs.mkShell {
    packages = with pkgs; [
      nodejs_24
      postgresql
      jdk17
      androidSdk.androidsdk
      ngrok
      scrcpy
      postman
      atlas
      android-tools
    ];

    ANDROID_HOME = "${androidSdk.androidsdk}/libexec/android-sdk";

    shellHook = ''
      echo ""
      echo "Environment Loaded!"
      export PGDATA=$PWD/.pgdata
      export PGHOST=$PWD/.pgdata
      export PGPORT=5433
      adb reverse tcp:5000 tcp:5000 || echo "Please Developer, plug in your phone to map localhost"
      adb reverse tcp:8081 tcp:8081 || echo "Please Dev, again. Never forget to plug in your phone"
      echo ""
   '';
  }
      /* echo "Node: $(node --version)"
      echo "Java: $(java -version 2>&1 | head -n 1)"
      echo "Environment Loaded: Node $(node --version) | Postgres $(postgres --version)"
      echo "Android SKD location: $ANDROID_HOME" */