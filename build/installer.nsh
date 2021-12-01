!macro customInstall
  DeleteRegKey HKCR "easy-movie"
  WriteRegStr HKCR "easy-movie" "" "URL:easy-movie"
  WriteRegStr HKCR "easy-movie" "URL Protocol" ""
  WriteRegStr HKCR "easy-movie\shell" "" ""
  WriteRegStr HKCR "easy-movie\shell\Open" "" ""
  WriteRegStr HKCR "easy-movie\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend

!macro customUnInstall
  DeleteRegKey HKCR "easy-movie"
!macroend