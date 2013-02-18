# TCS E-Mail Node Client

---

This document describes the client module for the TCS e-mail service.  
It is designed to simplify the requests to the service and provides a usable and expendable interface to integrate the service as easy as possible.

## `MailFactory`

### Initialize

#### `new MailFactory( appid, sendermail [, config ] )`

Creates the mail factory to send mail via the tcs mail service.

**arguments**

* `appid` *( String )*: The app id to send mails.
* `sendermail` *( String )*: The sender address.
* `config` *( Object [ optional ] )*: Configuration object.<a id="factoryconfig"></a>
* `config.endpoint` *( String [ optional; default = "http://node.tcs.de/email/send" ] )*: The url to the tcs mail service.
* `config.security` *( Object [ optional; default = {} ] )*: If there are some security credentials within your configuration put them here.
* `config.returnPath` *( String [ optional; default = "bounces@tcs.de" ] )*: Adress for returning mails.
* `config.source` *( String [ optional; default = @sendermail ] )*: Usually this will be the sender mail. But it's possible to us a human friendly naming.
* `config.replyToAddresses` *( String | Array )*: A single reply address or an array of multiple addresses as standard reply. This could be overwritten by `Mail.reply( mails )`
* `config.charset` *( String [ optional; default = "utf-8" ] )*: General charset. Changing this config will effect all charset configurations.
* `config.charsetHtml` *( String [ optional; default = "utf-8" ] )*: Html charset. Will only be send to server if not `utf-8`
* `config.charsetText` *( String [ optional; default = "utf-8" ] )*: Html charset. Will only be send to server if not `utf-8`
* `config.charsetSubject` *( String [ optional; default = "utf-8" ] )*: Html charset. Will only be send to server if not `utf-8`

**TBD** Template configuraton

* `config.tmplLanguage` *( String [ optional ] )*: A standard language string like `de_DE` or `en_US` to define the language for using the template. 
* `config.tmplPath` *( String [ optional ] )*: … 
* `config.tmplType` *( String [ optional ] )*: … 

### Methods

#### `.config( config )`

Change the configuration in operating.

**arguments**

* `config` *( Object [ optional ] )*: Configuration object. Details see [factory config](#factoryconfig)

**Return**

*( Object )*: the current configuration

#### `.create()`

create and return a new `Mail` object. This is used to define the receivers content and at least send the email.

**Return**

*( Mail )*: The Mail object as described [here](#mailobj) 

#### `.get( id )`

get a single mail object.

**arguments**

* `id` *( String )*: The mail id.

**Return**

*( Mail )*: A `Mail` object.

#### `.each( iterator )`

Loop through all mail objects. 

**arguments**

* `iterator` *( Function )*: Iteration method with the arguments

**example**

```
MailFactory.each ( id, mailObj )->
	...
```

#### `.sendAll( callback )`

Send all open Mails.

**arguments**

* `callback` *( Function )*: Callback method called after all mails has been send.

## `Mail` Object methods<a id="mailobj"></a>

The `Mail` object can be generated by the `MailFactory.mail()` Method.
Within this object you can define all option by using the according method.

If all options has been set you have to call the `.send()` method to send the mail via the tcs mail service.

### Properties

#### `Mail.id`

*( String )*

Every mail will get a unique id to be able predefine a lot of mails and send them in bulk.

#### `Mail.created`

Timestamp the `Mail` object has been created. Just to be able to destroy outdated mails later.

### Methods

#### `Mail.to( mails )`

Set the main **TO** addresses. If set to null or an empty array the current **TO** will be cleared.

**arguments**

* `mails` *( String | Array )*: A single receiver address or an array of multiple receivers.

**Return**

*( Mail )*: The `Mail` object self for chaining.

#### `Mail.cc( mails )`

Set the **CC** addresses. If set to null or an empty array the current **CC** will be cleared

**arguments**

* `mails` *( String | Array )*: A single receiver address or an array of multiple receivers.

**Return**

*( Mail )*: The `Mail` object self for chaining.

#### `Mail.bcc( mails )`

Set the **BCC** addresses. If set to null or an empty array the current **BCC** will be cleared

**arguments**

* `mails` *( String | Array )*: A single receiver address or an array of multiple receivers.

**Return**

*( Mail )*: The `Mail` object self for chaining.

#### `Mail.subject( subject [, charset ] )`

Set the subject of this mail. If set to null subject will be cleared

**arguments**

* `mails` *( String )*: A subject string to describe the content of this mail
* `charset` *( String [ optional, default=config.charsetSubject ] )*: Overwrite default charset

**Return**

*( Mail )*: The `Mail` object self for chaining.

#### `Mail.reply( mails )`

The Reply addresses the mail answers will send to. If set to null or an empty array the current **REPLY** will be cleared.  
If this method is not used the standard from `MailFactory.config.replyToAddresses` will be used.

**arguments**

* `mails` *( String | Array )*: A single receiver address or an array of multiple receivers.

**Return**

*( Mail )*: The `Mail` object self for chaining.

#### `Mail.return( mail )`

The return address failed mails will bounce to.
If this method is not used the standard from `MailFactory.config.returnPath` will be used.

**arguments**

* `mails` *( String )*: A single return address.

**Return**

*( Mail )*: The `Mail` object self for chaining.

#### `Mail.html( source [, charset ] )`

The raw mail html source to send.

**arguments**

* `source` *( String )*: Mail html source.
* `charset` *( String [ optional, default=config.charsetHtml ] )*: Overwrite default charset

**Return**

*( Mail )*: The `Mail` object self for chaining.

#### `Mail.text( text [, charset ] )`

The raw mail text to send.

**arguments**

* `source` *( String )*: Mail html source.
* `charset` *( String [ optional, default=config.charsetHtml ] )*: Overwrite default charset

**Return**

*( Mail )*: The `Mail` object self for chaining.

#### `Mail.tmpl( tmplName, data [, language, type ] )`

**Template handling TBD**

- Should set html and text at once if defined.
- Should handle the language

#### `Mail.send( callback )`

Send this mail. If there is some missing data a error will be returned.
after a successful send the `Mail` object will be destroyed automatically.

**arguments**

* `callback` *( Function )*: Called after the mail has been send.

#### `Mail.destroy()`

Destroy the `Mail` object. 

## Example

This is simple a full example to send a mail.

```
# create the factory
mailFactory = new MailFactory( "wmshop", "shopbot@webmart.de" )

# create a mail object
mail = mailFactory.create()

# set the data
mail.to( "abc@tcs" ).cc( [ "ghi@tcs.de", "def@tcs.de" ] )

mail.subject( "Test" )

mail.html( "<h1>My Test Mail</h1><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>" )

mail.text( "My Test Mail\n\nLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa." )

# send the mail
mail.send ( err )=>
	if err
		console.error( err ) 
		return
	console.log( "SUCCESS" )
	return

```