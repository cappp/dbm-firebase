module.exports = {

    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action ed in the editor.
    //---------------------------------------------------------------------
    
    name: "Control Firebase Global Data",
    
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
        return `(${data.dataName}) ${data.controlType === "1" ? "+=" : "="} ${data.value}`;
    },
    
    // Who made the mod (If not set, defaults to "DBM Mods")
    author: "Cap",
    
    // The version of the mod (Last edited version number of DBM Mods)
    version: "1.9.7", //Added in 1.9.7
    
    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "Control your Firebase global data.",
    
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
    
    fields: ["dataName", "controlType", "value"],
    
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
        <div style="float: left; width: 50%">
            Data Name:<br>
            <input id="dataName" type="text" class="round">
        </div>
        <div style="float: right; width: 45%">
            Control Type:<br>
            <select id="controlType" class="round">
                <option value="0" selected>Set Value</option>
                <option value="1">Add Value</option>
            </select>
        </div><br><br><br>
        <div style="padding-top: 8px">
            Value:<br>
            <input id="value" class="round" type="text" placeholder="Use '' for insert text. Ex: 'Hello DBM'">
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
    
    init: function() {},
    
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
        const firebase  = this.getWrexMods().require("firebase");

        const dataName = this.evalMessage(data.dataName, cache);
        const controlType = parseInt(data.controlType);

        let value = this.evalMessage(data.value, cache);
        value = this.eval(value, cache);

        if (!fs.existsSync("./data/fbConfig.json")) {
            return console.log("You do not have the fbConfig.json file in your bot to continue. Visit this repository to learn how to do it: https://github.com/CapOliveiraBr/DBM-Firebase");
        }

        const fbConfig = JSON.parse(fs.readFileSync("./data/fbConfig.json", "utf-8"));

        if (dataName && value) {
            try {
                firebase.initializeApp(fbConfig);
                const path = firebase.database().ref(`data/globals/${dataName}`);
                if (controlType === 0) {
                    path.set(value);
                } else {
                    path.once("value")
                        .then(data => {
                            path.set(data.val() + value);
                        });
                    }
            } catch(err) {
                if (err.code == "app/duplicate-app") {
                    const path = firebase.database().ref(`data/globals/${dataName}`);
                    if (controlType === 0) {
                        path.set(value);
                    } else {
                        path.once("value")
                            .then(data => {
                                path.set(data.val() + value);
                            });
                        }
                } else {
                    console.error(err);
                }
            }
        }

        this.callNextAction(cache);
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
    