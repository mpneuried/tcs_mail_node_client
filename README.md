# TCS E-Mail Node Client

---

This document describes the client module for the TCS e-mail service.  
It is designed to simplify the requests to the service and provides a usable and expendable interface to integrate the service as easy as possible.

## Concept

Needed parts for this client.

- Configuration
- Authentication 
- Templating 
- Sending

## Methods

### initialize



### `.setAuth( appid, sendermail[, config ] )`

`Config.charset = "utf-8"`
Will only be send to server if not `utf-8`

`Config.charsetHtml = "utf-8"`
Will only be send to server if not `utf-8`

`Config.charsetText = "utf-8"`
Will only be send to server if not `utf-8`

`Config.charsetSubject = "utf-8"`
Will only be send to server if not `utf-8`

`Config.returnPath = ""`

`Config.source = ""`

`Config.tmplPath = ""`

### `.setConfig( config )`

### `.send( receiver, subject, data, options, callback )`

### `.newMail()`

returns a `Mail` object

The `Mail` Object has the following methods

### `Mail.to( mails )`

### `Mail.cc( mails )`

### `Mail.bcc( mails )`

### `Mail.subject( subject )`

### `Mail.reply( mails )`

### `Mail.return( mail )`

### `Mail.source( source )`



### `Mail.html( source, charset )`

### `Mail.text( text, charset )`

### `Mail.tmpl( tmplName, data, type )`

### `Mail.send( callback )`