module.exports = {

    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------
    
    name: "Delete Firebase Member Data",
    
    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------
    
    section: "Other Stuff",
    
        
    //---------------------------------------------------------------------
    // DBM Mods Manager Variables (Optional but nice to have!)
    //
    // These are variables that DBM Mods Manager uses to show information
    // about the mods for people to see in the list.
    //---------------------------------------------------------------------
    
    //---------------------------------------------------------------------
    // Action Subtitle
    //
    // This function generates the subtitle displayed next to the name.
    //---------------------------------------------------------------------
    
    subtitle: function(data) {
        const members = ['Mentioned User', 'Command Author', 'Temp Variable', 'Server Variable', 'Global Variable'];
        return `${members[parseInt(data.member)]} - ${data.dataName}`;
    },
    
    // Who made the mod (If not set, defaults to "DBM Mods")
    author: "Cap",
    
    // The version of the mod (Last edited version number of DBM Mods)
    version: "1.9.6", //Added in 1.9.6
    
    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "Delete a Firebase member data.",
    
    // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
    // Uncomment if you need this. Also, replace WrexMODS if needed.
    depends_on_mods: ["WrexMODS"],
    
    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------
    
    fields: ["member", "varName", "dataName"],
    
    //---------------------------------------------------------------------
    // Command HTML
    //
    // This function returns a string containing the HTML used for
    // editting actions. 
    //
    // The "isEvent" parameter will be true if this action is being used
    // for an event. Due to their nature, events lack certain information, 
    // so edit the HTML to reflect this.
    //
    // The "data" parameter stores constants for select elements to use. 
    // Each is an array: index 0 for commands, index 1 for events.
    // The names are: sendTargets, members, roles, channels, 
    //                messages, servers, variables
    //---------------------------------------------------------------------
    
    html: function(isEvent, data) {
        return `
    <div>
        <p>
            <u>Mod Info:</u><br>
            Created by <b>${this.author}</b>
        </p>
    </div><br>
	<div style="float: left; width: 35%;">
		Member:<br>
		<select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
			${data.members[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList">
    </div><br><br><br>
    <div style="padding-top: 8px;">
	    <div style="float: left; width: 78%;">
		    Data Name:<br>
		    <input id="dataName" class="round" type="text" placeholder="Leave blank to delete all member datas...">
	    </div>
        `
    },
    
    //---------------------------------------------------------------------
    // Action Editor Init Code
    //
    // When the HTML is first applied to the action editor, this code
    // is also run. This helps add modifications or setup reactionary
    // functions for the DOM elements.
    //---------------------------------------------------------------------
    
    init: function() {
        const {glob, document} = this;

        glob.memberChange(document.getElementById('member'), 'varNameContainer');
    },
    
    //---------------------------------------------------------------------
    // Action Bot Function
    //
    // This is the function for the action within the Bot's Action class.
    // Keep in mind event calls won't have access to the "msg" parameter, 
    // so be sure to provide checks for variable existance.
    //---------------------------------------------------------------------
    
    action: function(cache) {
        const data = cache.actions[cache.index];
        const fs = require("fs");
        const firebase = this.getWrexMods().require("firebase");

        const type = parseInt(data.member);
        const varName = this.evalMessage(data.varName, cache);
        const member = this.getMember(type, varName, cache);

        const dataName = this.evalMessage(data.dataName, cache);
        
        if (!fs.existsSync("./data/fbConfig.json")) {
            return console.log("You do not have the fbConfig.json file in your bot to continue. Visit this repository to learn how to do it: https://github.com/CapOliveiraBr/DBM-Firebase");
        }

        const fbConfig = JSON.parse(fs.readFileSync("./data/fbConfig.json", "utf-8"));

        if (member) {
            try {
                firebase.initializeApp(fbConfig);
                if (dataName) {
                    firebase.database().ref(`data/players/${member.id}/${dataName}`).remove();
                } else {
                    firebase.database().ref(`data/players`).remove();
                }
            } catch(err) {
                if (err.code == "app/duplicate-app") {
                    if (dataName) {
                        firebase.database().ref(`data/players/${member.id}/${dataName}`).remove();
                    } else {
                        firebase.database().ref(`data/players`).remove();
                    }
                } else {
                    console.error(err);
                }
            }
        }
    },
    
    //---------------------------------------------------------------------
    // Action Bot Mod
    //
    // Upon initialization of the bot, this code is run. Using the bot's
    // DBM namespace, one can add/modify existing functions if necessary.
    // In order to reduce conflictions between mods, be sure to alias
    // functions you wish to overwrite.
    //---------------------------------------------------------------------
    
    mod: function(DBM) {
    }
    
    }; // End of module
    