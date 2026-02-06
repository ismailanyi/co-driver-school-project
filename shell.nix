{ pkgs ? import <nixpkgs> { config = { 
  allowUnfree = true;
   }; } }:

let 
  androidSdk = pkgs.androidenv.composeAndroidPackages {
    cmdLineToolsVersion = "13.0";
    # toolsVersion ? "latest",
    platformToolsVersion = "35.0.1";
    buildToolsVersions = [ "34.0.0" ];
    platformVersions = [ "34" ];

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
    ];

    ANDROID_HOME = "${androidSdk.androidsdk}/libexec/android-sdk";

    shellHook = ''
      echo "Environment Loaded!"
      echo "Node: $(node --version)"
      echo "Java: $(java -version 2>&1 | head -n 1)"
      echo "Environment Loaded: Node $(node --version) | Postgres $(postgres --version)"
      echo "Android SKD location: $ANDROID_HOME"
      export PGHOST=$PWD
      echo $PGHOST
    '';
  }