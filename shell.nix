{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = [
    pkgs.nodejs_22  # Let's stick to the current LTS to be safe
    pkgs.postgresql
  ];

  shellHook = ''
    echo "Environment Loaded: Node $(node --version) | Postgres $(postgres --version)"
  '';
}