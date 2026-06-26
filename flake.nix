{
    description = "Co-Driver flake";

    inputs = {
        nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
        flake-utils.url = "github:numtide/flake-utils";
    };

    outputs = { self, nixpkgs, flake-utils}:
        flake-utils.lib.eachDefaultSystem (system: 
            let
                pkgs = import nixpkgs { 
                    inherit system; 
                    config = { 
                        allowUnfree = true;
                        android_sdk.accept_license = true;
                    };
                };

                androidSdk = pkgs.androidenv.composeAndroidPackages {
                    cmdLineToolsVersion = "13.0";
                    # toolsVersion ? "latest",
                    platformToolsVersion = "35.0.2";
                    buildToolsVersions = [ "36.0.0" ];
                    platformVersions = [ "36" ];
                    includeNDK = true;
                    ndkVersions = [ "27.1.12297006"];
                    
                    includeEmulator = false;
                    includeSystemImages = false;
                };

                frontendShell = ''
                    # Start ADB server safely without inheriting standard file descriptors, preventing hangs in direnv
                    adb start-server < /dev/null > /dev/null 2>&1

                    # Map ports if a device is connected, otherwise print a warning
                    if adb devices | grep -v "List of devices attached" | grep -q "device"; then
                        adb reverse tcp:5000 tcp:5000 >/dev/null 2>&1
                        adb reverse tcp:8081 tcp:8081 >/dev/null 2>&1
                        adb reverse tcp:8082 tcp:8082 >/dev/null 2>&1
                        adb reverse tcp:8083 tcp:8083 >/dev/null 2>&1
                    else
                        echo "Please Developer, plug in your phone to map localhost"
                        echo "Please Dev, again. Never forget to plug in your phone"
                    fi
                '';
                backendShell = ''
                    export PGDATA=$PWD/.pgdata
                    export PGHOST=$PWD/.pgdata
                    export PGPORT=5433
                '';
                defaultShell = ''
                    echo "Environment Loaded!"
                '';
                makeWorkspace = workspace: tools: shell: pkgs.mkShell {
                    buildInputs = tools;
                    shellHook = shell;
                    env = {
                        DIRENV_LOG_FORMAT = "";
                    };
                    ANDROID_HOME = "${androidSdk.androidsdk}/libexec/android-sdk";
                };
            in with pkgs; let
                both = [nodejs_24];
                frontendTools = both ++ [androidSdk.androidsdk android-tools jdk17 bun scrcpy];
                backendTools = both ++ [supabase-cli postgresql atlas];
                defaultTools = frontendTools ++ backendTools;
            in {
                devShells = {
                    frontend = makeWorkspace "frontend" frontendTools frontendShell;
                    backend = makeWorkspace "backend" backendTools backendShell;
                    default = makeWorkspace "default" defaultTools defaultShell;
                };
            }
        )
    ;
}


/* echo "Node: $(node --version)"
echo "Java: $(java -version 2>&1 | head -n 1)"
echo "Environment Loaded: Node $(node --version) | Postgres $(postgres --version)"
echo "Android SKD location: $ANDROID_HOME" */