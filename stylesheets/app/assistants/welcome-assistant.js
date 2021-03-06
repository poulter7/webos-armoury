function WelcomeAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

WelcomeAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
	
	this.storyMenuAttr = {
		visible: true,
		items: [{ items: [	{label: $L('Profile'), command: 'do-showProfile'}, 
							{label: $L('Model'), command: 'do-showModel'	}] },
				{ items: [  {label: $L('GO!'), command: 'do-getData'}]}]
	};
	this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, this.storyMenuAttr);
	
	// TODO: Remove this button's code
        this.total = 0;
     	this.controller.get("count").update(this.total);
		this.buttonAttributes = {};

        this.buttonModel = {
	        "label" : "TAP ME BITCH!",
	        "buttonClass" : "",
	        "disabled" : false
        };

        this.controller.setupWidget("MyButton", this.buttonAttributes, this.buttonModel);
        Mojo.Event.listen(this.controller.get("MyButton"), Mojo.Event.tap, this.handleButtonPress.bind(this));

	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */
};

WelcomeAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

WelcomeAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

WelcomeAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};

WelcomeAssistant.prototype.handleButtonPress = function(event){
  // increment the total and update the display
	this.total++;
    this.controller.get("count").update(this.total);
	if(this.total>=10){
		this.buttonModel["label"] = "I'm bored now...";
		this.buttonModel["disabled"] = true;
		this.controller.modelChanged(this.buttonModel, this);
	}
};

// Handle the commandMenu
WelcomeAssistant.prototype.handleCommand = function(event) {
  	if(event.type == Mojo.Event.command) {
		
		// show the right one
	    switch(event.command) {
			case 'do-showProfile':
				this.hideClass("central-column");
				document.getElementById("profile-column").style.display = "block";
			break;
			case 'do-showModel':
				this.hideClass("central-column");
				document.getElementById("model-column").style.display = "block";
			break;
			case 'do-getData':
				Mojo.Log.info("*** Loading character ***");
				this.getData();
				this.setItemIcons();
			break;
	    }
  	}
};

WelcomeAssistant.prototype.hideClass = function(class_name) {
		// hide all possible middle panels
		var l = document.getElementsByClassName(class_name);
	  	for (var i = 0; i < l.length; i++){
			l[i].style.display= "none"
		};
};

WelcomeAssistant.prototype.getData = function(){
	var url = "http://eu.wowarmory.com/character-sheet.xml?r=Shadowsong&cn=Tianor&rhtml=n";
	var request = new Ajax.Request(url, {
        method: "get",
        evalJSON: "false",
        onSuccess: this.success.bind(this),
        onFailure: function(){ Mojo.Log.info("Fail")}
    });	
};

WelcomeAssistant.prototype.success = function(transport){
    
    // DEBUG - Work around due occasion Ajax XML error in response.
    if (transport.responseXML === null && transport.responseText !== null) {
            transport.responseXML = new DOMParser().parseFromString(transport.responseText, "text/xml");
     }
	 // get the xml out globally, then process the page!
	 profileXML = transport.responseXML;
	 if (profileXML == null) {
		this.hideClass("central-column");
		document.getElementById("error-column").style.display = "block";
	 } else {
	 	this.setIcons();
	 }
};


WelcomeAssistant.prototype.setItemIcons = function(){
	// items - from XML
	// icons - placeholders in HTML
	var items = profileXML.getElementsByTagName('item');
	var icons = document.getElementsByClassName('icon');
	
	/*
	 * Currently image caching is broken in WebOS 1.4
	 */
	if (false) {
		// create image
		imageObj = new Image();
		var images = new Array();
		// start preloading
		for (i = 0; i < items.length; i++) {
			imageObj.src = "http://eu.wowarmory.com/wow-icons/_images/51x51/" + items[i].getAttribute("icon") + ".jpg";
		}
	}
	// icon.src = "path-to-image";	
	for (var i = 0; i < items.length; i++) {
		
		document.getElementById("slot"+items[i].getAttribute("slot")).src = "http://eu.wowarmory.com/wow-icons/_images/51x51/" + items[i].getAttribute("icon") + ".jpg";
		//}
	}
};
