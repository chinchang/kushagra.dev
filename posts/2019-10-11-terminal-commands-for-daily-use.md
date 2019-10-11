---
layout: post
title: "Terminal commands for daily use"
tags:
  - tutorial
  - shell
  - cli
---

This post is a compilation of the most used commands I use in my terminal daily. A reason to share this compilation is to give a quick introduction to how a few very common regular tasks can be done through commands in a terminal. I find running commands in the terminal a lot faster than otherwise doing through the GUI and hence makes me more productive. If you feel you are better without them, that is completely fine too. But I suggest everyone should try them to see what works best for you.

There are 2 bonus tips at the end of this post to give you that extra productivity boost. Do read till the end.

## List all files with human-readable filesizes

```bash
ls -lah some/folder/path
```

- `l` - lists the files **l**ong format.
- `a` - lists **a**ll the files.
- `h` - lists filesize in more **h**uman-readable way.

Tip: you can list files of the current folder with `ls .`

## Switch directory

```bash
cd some/folder/path
```

## Create a new file

```bash
touch fileName.js
```
Creates an empty file with the name `fileName.js`.

## Create a new folder

```bash
mkdir new-folder-name
```

## Copy a file

```bash
cp copyFrom.js copyTo.js
```

## Rename a file

```bash
mv oldFile.js newFile.js
```

## Open a file in Visual Studio Code (VSCode)

```bash
code fileName.css
```

This is really useful. If you are not aware, VSCode can be added as a shell command too. Here is [how to add VSCode as shell command][vscode-command].

## Git commands

I am going to club these into one section.

- `git status` - Check the status of the repository in the current directory
- `git checkout master` - Switch to `master` branch
- `git pull --rebase origin <branch_name>` - Pull remote changes from a branch called `branch_name` and apply my unpushed changes over those pulled changes
- `git commit -m "my message here" - Commit changes
- `git push origin <branch_name>` - Push changes of branch `branch_name` to remote

## Open any file (Max OSX only)

```bash
open /some/path/filename.ext
```

This basically works like double-clicking a file in the GUI file explorer. It opens the file in the default program set for that type of file. Super useful!

`open` is a Mac OSX command, but I am sure every OS has something similar.

## Bonus Tips

### Quickly accessing your terminal

When you start using your terminal for little quick things like mentioned above, it becomes all the more necessary that you are able to do them fast enough without any overhead. And so it makes sense to do some tweaks to make your terminal accessible as quickly as possible.

For that, you can do 2 things.

1. First, set your terminal to show as an overlay on the screen i.e. on top of whatever window you have open in front of you. In case you have spaces (also referred as workspaces) enabled on your machine, showing as overlay prevents unnecessary context switch in changing spaces (because you'll switch to whatever space the terminal window is in) and also removes the time delay it would take to switch spaces. Overlay terminal shows instantly.
2. Next, set a hotkey on your terminal. That enables you to show up your terminal with a quick keyboard shortcut.

Most terminals (I have tested on Hyper and iTerm) let you do the above things natively or through some plugin.

### Aliases

With time, you'll realise that you use a few commands more frequently than others. For these commands, you can set [aliases][aliases]. Aliases are short names given to commands so that you don't have to type the complete command again and again. Whatever shell you are using, they allow setting aliases. You can find how to set aliases in your shell by searching "How to set aliases in <your_shell_name>". By default, most operating systems give your `bash` shell.

Also, here is a good article on [setting aliases in few different shells][how-to-set-aliases].

Hope this post proves useful to you and give you some extra productivity boost! Ciao!

[vscode-shell]: https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line
[aliases]: http://www.peachpit.com/articles/article.aspx?p=31442&seqNum=5
[how-to-set-aliases]: https://www.thegeekdiary.com/examples-of-creating-command-alias-in-different-shells/

