module.exports = {

    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action ed in the editor.
    //---------------------------------------------------------------------
    
    name: "Store Firebase Member Data List",
    
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
        const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
        return `Store "${data.dataName || 'Not Set'}" Firebase Member Data in a List - ${storage[data.storage]}`;
    },
    
    // Who made the mod (If not set, defaults to "DBM Mods")
    author: "Cap",
    
    // The version of the mod (Last edited version number of DBM Mods)
    version: "1.9.7", //Added in 1.9.7
    
    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "Stores firebase member data in a list.",
    
    // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
    // Uncomment if you need this. Also, replace WrexMODS if needed.
    depends_on_mods: ["WrexMODS"],

    //---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		return ([data.varName, 'List']);
	},
    
    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------
    
    fields: ["dataName", "showDataGlobally", "numberBeforeStart", "sortType", "resultLimit", "resultFormat", "storage", "varName"],
    
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
        <div style="width: 550px; height: 350px; overflow-y: scroll;">
            <div>
                <p>
                    <u>Mod Info:</u><br>
                    Created by <b>${this.author}</b>
                </p>
            </div><br>
            <div style="float: left; width: 60%;">
                Data Name:<br>
                <input id="dataName" type="text" class="round">
            </div>
            <div style="float: right; width: 35%; margin-right: 20px;">
                Show Data Globally:<br>
                <select id="showDataGlobally" class="round">
                    <option value="0" selected>No</option>
                    <option value="1">Yes</option>
                </select>
            </div><br><br><br>
            <div style="float: left; padding-top: 8px; width: 38%;">
                Number Before Start:<br>
                <select id="numberBeforeStart" class="round">
                    <option value="0" selected>Yes</option>
                    <option value="1">No</option>
                </select>
            </div>
            <div style="float: right; padding-top: 8px; width: 50%; margin-right: 30px;">
                Sort By:<br>
                <select id="sortType" class="round">
                    <option value="0" selected>Descending</option>
                    <option value="1">Ascending</option>
                    <option value="2">Don't Sort</option>
                </select>
            </div><br><br><br>
            <div style="padding-top: 16px; width: 41%;">
                Result Limit:<br>
                <input id="resultLimit" class="round" placeholder="Leave Blank for Show All" value="10">
            </div><br>
            <div style="width: 80%;">
                Result Format (JavaScript String):<br>
                <textarea id="resultFormat" rows="3" placeholder="Default: '. ' + member + ' - ' + dataName + ': ' + dataValue" style="resize: none; width: 122%;" >'. ' + member + ' - ' + dataName + ': ' + dataValue</textarea>
            </div><br>
            <div style="float: left; width: 35%;">
                Store In:<br>
                <select id="storage" class="round">
                    ${data.variables[1]}
                </select>
            </div>
            <div id="varNameContainer" style="float: right; width: 60%;">
                Variable Name:<br>
                <input id="varName" class="round" type="text">
            </div><br><br><br>
            <div style="padding-top: 16px;">
                <h3><u>Mini Docs</u></h3>
                    <b>member</b> - Member object in list.<br>
                <h4><u>Properties</u></h4>
                    <i>Note: do not use .user if global data is enabled</i><br><br>
                    <b>.user.tag</b> - Show the member tag.<br>
                    <b>Example:</b> <span id="code">member.user.tag</span><br><br>
                    <b>.user.username</b> - Show the member username.<br>
                    <b>Example:</b> <span id="code">member.user.username</span><br><br>
                    <b>.user.id</b> - Show the member id.<br>
                    <b>Example:</b> <span id="code">member.user.id</span><br><br>
                    <b>.displayName</b> - Show the member display name.<br>
                    <b>Example:</b> <span id="code">member.displayName</span><br><br>
                    <b>Show more here:</b><br><span class="wrexlink" data-url="https://discord.js.org/#/docs/main/stable/class/User">https://discord.js.org/#/docs/main/stable/class/User</span><br><span class="wrexlink2" data-url2="https://discord.js.org/#/docs/main/stable/class/GuildMember">https://discord.js.org/#/docs/main/stable/class/GuildMember</span>
                <h4><u>Others</u></h4>
                    <b>dataName</b> - Data name of the list.<br>
                    <b>dataValue</b> - Data value for each registered member.
            </div>
        </div>
        <style>
            span.wrexlink, span.wrexlink2 {
                color: #99b3ff;
                text-decoration: underline;
                cursor: pointer;
            }

            span.wrexlink:hover, span.wrexlink2:hover { 
                color: #4676b9;
            }

            #code {
                background: #2C313C;
                color: white;
                padding: 3px;
                font-size: 12px;
                border-radius: 2px;
            }
        </style>
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
        const {document} = this;

        var wrexlinks = document.getElementsByClassName("wrexlink")
        for (var x = 0; x < wrexlinks.length; x++) {
          
          var wrexlink = wrexlinks[x];
          var url = wrexlink.getAttribute('data-url');   
          if (url) {
            wrexlink.setAttribute("title", url);
            wrexlink.addEventListener("click", function(e){
              e.stopImmediatePropagation();
              console.log("Launching URL: [" + url + "] in your default browser.")
              require('child_process').execSync('start ' + url);
            });
          }   
        }

        var wrexlinks2 = document.getElementsByClassName("wrexlink2")
        for (var x2 = 0; x2 < wrexlinks2.length; x2++) {
          
          var wrexlink2 = wrexlinks2[x2];
          var url2 = wrexlink2.getAttribute('data-url2');   
          if (url2) {
            wrexlink2.setAttribute("title", url2);
            wrexlink2.addEventListener("click", function(e2){
              e2.stopImmediatePropagation();
              console.log("Launching URL: [" + url2 + "] in your default browser.")
              require('child_process').execSync('start ' + url2);
            });
          }   
        } 
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
        const client = this.getDBM().Bot.bot;
        const fs = require('fs');
        const firebase  = this.getWrexMods().require('firebase');
        const sort = this.getWrexMods().require('fast-sort');

        const dataName = this.evalMessage(data.dataName, cache);
        const showDataGlobally = parseInt(data.showDataGlobally);

        const numberBeforeStart = parseInt(data.numberBeforeStart);
        const sortType = parseInt(data.sortType);
        
        const resultLimit = parseInt(this.evalMessage(data.resultLimit, cache));
        let resultFormat = this.evalMessage(data.resultFormat, cache);

        const list = [];
        let resultList = [];
        let position = 0;

        if (!fs.existsSync('./data/fbConfig.json')) {
            return console.log('You do not have the fbConfig.json file in your bot to continue. Visit this repository to learn how to do it: https://github.com/CapOliveiraBr/DBM-Firebase');
        }

        const fbConfig = JSON.parse(fs.readFileSync('./data/fbConfig.json', 'utf-8'));

        try {
            if (!dataName) return;

            firebase.initializeApp(fbConfig);
            firebase.database().ref(`data/players`).orderByKey().once('value')
                .then(i => {
                    i.forEach(players => {
                        if (players.child(dataName).val() === null) return;

                        if (showDataGlobally === 0) {
                            if (cache.server.members.map(m => m.id).indexOf(players.key) == -1) return;
                        } else {
                            if (client.users.map(u => u.id).indexOf(players.key) == -1) return;
                        }

                        list.push({
                            userID: players.key,
                            value: players.child(dataName).val()
                        });
                    });

                    let listType;

                    switch(sortType) {
                        case 0:
                            listType = sort(list).desc(u => parseInt(u.value));
                            break;
                        case 1:
                            listType = sort(list).asc(u => parseInt(u.value));
                            break;
                        case 2:
                            listType = list;
                            break;
                    }

                    listType.forEach(() => {
                        let dataValue = listType[position].value;

                        switch(showDataGlobally) {
                            case 0:
                                member = cache.server.members.get(listType[position].userID);
                                break;
                            case 1:
                                member = client.users.get(listType[position].userID);
                                break;
                        }

                        resultList.push(numberBeforeStart === 0 ? `${position + 1}${resultFormat ? eval(resultFormat) : '. ' + member + ' - ' + dataName + ': ' + dataValue}` : `${resultFormat ? eval(resultFormat) : '. ' + member + ' - ' + dataName + ': ' + dataValue}`);
                        position++;
                    });

                    resultList.length = resultLimit;
                    resultList = resultList.join('\n');

                    if (resultList !== undefined) {
                        const storage = parseInt(data.storage);
                        const varName = this.evalMessage(data.varName, cache);
                        this.storeValue(resultList, storage, varName, cache);
                    }
                    this.callNextAction(cache);
                });
        } catch(err) {
            if (err.code == 'app/duplicate-app') {
                if (!dataName) return;

                firebase.database().ref(`data/players`).orderByKey().once('value')
                    .then(i => {
                        i.forEach(players => {
                            if (players.child(dataName).val() === null) return;

                            if (showDataGlobally === 0) {
                                if (cache.server.members.map(m => m.id).indexOf(players.key) == -1) return;
                            } else {
                                if (client.users.map(u => u.id).indexOf(players.key) == -1) return;
                            }
                            
                            list.push({
                                userID: players.key,
                                value: players.child(dataName).val()
                            });
                        });

                        let listType;

                        switch(sortType) {
                            case 0:
                                listType = sort(list).desc(u => parseInt(u.value));
                                break;
                            case 1:
                                listType = sort(list).asc(u => parseInt(u.value));
                                break;
                            case 2:
                                listType = list;
                                break;
                        }

                        listType.forEach(() => {
                            let dataValue = listType[position].value;

                            switch(showDataGlobally) {
                                case 0:
                                    member = cache.server.members.get(listType[position].userID);
                                    break;
                                case 1:
                                    member = client.users.get(listType[position].userID);
                                    break;
                            }

                            resultList.push(numberBeforeStart === 0 ? `${position + 1}${resultFormat ? eval(resultFormat) : '. ' + member + ' - ' + dataName + ': ' + dataValue}` : `${resultFormat ? eval(resultFormat) : '. ' + member + ' - ' + dataName + ': ' + dataValue}`);
                            position++;
                        });

                        resultList.length = resultLimit;
                        resultList = resultList.join('\n');

                        if (resultList !== undefined) {
                            const storage = parseInt(data.storage);
                            const varName = this.evalMessage(data.varName, cache);
                            this.storeValue(resultList, storage, varName, cache);
                        }
                        this.callNextAction(cache);
                    });
            } else {
                console.error(err);
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
    