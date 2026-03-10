#!/usr/bin/env fish
ping -c 1 -W 1 google.com > /dev/null 2>&1 || set NIX_FLAG '--option substitute false'; nix-shell $NIX_FLAG --run $argv[1]