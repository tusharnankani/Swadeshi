const TRANSLATION = [
	// TITLE
	{
		selector: "title",
		en: "Swadeshi",
		hi: "स्वदेशी"
	},
	// NAVBAR
	{
		selector: "#body > nav > ul > li:nth-child(1) > a",
		en: "Home",
		hi: "होम पेज"
	},
	{
		selector: "#body > nav > ul > li:nth-child(2) > a",
		en: "About Us +",
		hi: "हमारे बारे में +"
	},
	{
		selector: "#body > nav > ul > li:nth-child(3) > a",
		en: "Contact Us",
		hi: "संपर्क करें"
	},
	{
		selector: "#body > nav > ul > li:nth-child(4) > a",
		en: "FAQS",
		hi: "सामान्य प्रश्नोत्तर"
	},

	// CONTACT PAGE
	{
		selector: ".contact > #company-name",
		en: "Contact Us",
		hi: "संपर्क करें"
	},
	{
		selector: "body > main > div.contact > h2",
		en: "Swadeshi's Helpline Center",
		hi: "स्वदेशी का हेल्पलाइन सेंटर"
	},
	{
		selector: "#farmer-vid > h3",
		en: "Help for Farmers",
		hi: "किसानों के लिए मदद"
	},
	{
		selector: "#wholesaler-vid > h3",
		en: "Help for Wholesaler",
		hi: "थोक व्यापारी के लिए मदद"
	},
	// FAQS
	{
		selector: ".about > #company-name",
		en: "FAQs",
		hi: "पूछे जाने वाले प्रश्न"
	},
	{
		selector: "body > main > div.about > button:nth-child(2)",
		en: "Where and when will farmers see the farmer's portal?",
		hi: "किसान पोर्टल कहाँ और कब देखेगा?"
	},
	{
		selector: "body > main > div.about > div:nth-child(3) > p",
		en: "First enter your number, and OTP on the home page, If not signed up on our database, it will not show the Farmer's Portal. It will redirect to a sign up page, where you can select your type, add your details. Once details are added, it will redirect you to the farmer or wholesaler's portal depending on what you chose in sign up page.",
		hi: "पहले होम पेज पर अपना नंबर, और ओटीपी दर्ज करें, अगर हमारे डेटाबेस पर साइन अप नहीं किया गया है, तो यह किसान का पोर्टल नहीं दिखाएगा। यह एक साइन अप पृष्ठ पर पुनर्निर्देशित करेगा, जहां आप अपने प्रकार का चयन कर सकते हैं, अपना विवरण जोड़ सकते हैं। एक बार विवरण जोड़ दिए जाने के बाद, यह आपको किसान या थोक व्यापारी के पोर्टल पर पुनर्निर्देशित करेगा जो आपने साइन अप पृष्ठ पर चुना है।"
	},
	{
		selector: "body > main > div.about > button:nth-child(4)",
		en: "How to add items to Manage Items list in Farmer's Portal?",
		hi: "किसान पोर्टल में आइटम सूची प्रबंधित करने के लिए आइटम कैसे जोड़ें?"
	},
	{
		selector: "body > main > div.about > button:nth-child(5) > p",
		en: "For adding items, there will be a plus icon under category, in manage items, which will redirect you to an Add Items page. You can add the category, item and fill in all the details, and press add. The item will be added to your list on Farmer's Portal.",
		hi: "आइटम जोड़ने के लिए, आइटम प्रबंधित करने में श्रेणी के अंतर्गत एक प्लस आइकन होगा, जो आपको एक आइटम जोड़ें पृष्ठ पर पुनर्निर्देशित करेगा। आप श्रेणी, आइटम जोड़ सकते हैं और सभी विवरण भर सकते हैं, और ऐड दबा सकते हैं। आइटम को किसान की पोर्टल पर आपकी सूची में जोड़ा जाएगा।"
	},
	{
		selector: "body > main > div.about > button:nth-child(6)",
		en: "How to remove items from current orders, and move to delivered orders?",
		hi: "वर्तमान आदेशों से आइटम कैसे निकालें, और वितरित आदेशों पर जाएं?"
	},
	{
		selector: "body > main > div.about > div:nth-child(7) > p",
		en: "For removing items from current orders, and move to delivered orders, you have to click on tick button on the extreme right corner of the list. Your item will be moved to past delivered items.",
		hi: "वर्तमान आदेशों से आइटम हटाने के लिए, और वितरित आदेशों पर जाने के लिए, आपको सूची के चरम दाएं कोने पर टिक बटन पर क्लिक करना होगा। आपका आइटम पिछले वितरित आइटमों में ले जाया जाएगा।"
	},
	{
		selector: "[onclick = 'toggleLanguage()'] li",
		en: "हिन्दी",
		hi: "English"
	}
];

let language = "en";
function toggleLanguage(){
	language = (language == "en")?"hi":"en";
	translateTo(language);
}

function translateTo(lang){
	for(let o of TRANSLATION)
		(get(o.selector) || {}).innerText = o[lang];
}