!macro customInstall

    SetShellVarContext current

    ; Backing up legacy databases (Windows only)
    IfFileExists "$APPDATA\${APP_FILENAME}\yn_databases\main.db" SkipCopy CopyLegacyDB
    SkipCopy:
      Goto done

    CopyLegacyDB:
      CopyFiles /SILENT "$APPDATA\${APP_FILENAME}\databases\main.db" "$APPDATA\${APP_FILENAME}\yn_databases\main.db"

    done:

!macroend

!macro customUnInstall

  SetShellVarContext current

  MessageBox MB_YESNO "Keep app configuration and data?" \
    /SD IDYES IDNO DeleteData IDYES KeepData

  DeleteData:
    RMDir /r "$APPDATA\${APP_FILENAME}"
    !ifdef APP_PRODUCT_FILENAME
      RMDir /r "$APPDATA\${APP_PRODUCT_FILENAME}"
    !endif
    Goto done

  KeepData:
    Goto done

  done:

!macroend
