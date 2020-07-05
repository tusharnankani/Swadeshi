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
	// HOME
	{
		selector: "#company-name",
		en: "Swadeshi",
		hi: "स्वदेशी"
	},
	{
		selector: "#tagline",
		en: "Connecting farmers everywhere.",
		hi: "किसानों को जोड़ना।"
	},
	{
		selector: "#body > main > div.description > div.farmer > h1",
		en: "For Farmers",
		hi: "किसानों के लिए"
	},
	{
		selector: "#body > main > div.description > div.farmer > div",
		en: "Add your vegetables, fruits and pulses right away!",
		hi: "अपनी सब्जियों, फलों और दालों को तुरंत जोड़ें!"
	},
	{
		selector: "#body > main > div.description > div.wholesale > h1",
		en: "For Wholesalers",
		hi: "थोक विक्रेताओं के लिए"
	},
	{
		selector: "#body > main > div.description > div.wholesale > div",
		en: "For bulk orders and extra offers, sign up with us!",
		hi: "थोक आदेश और अतिरिक्त ऑफ़र के लिए, हमारे साथ साइन अप करें!"
	},
	{
		selector: "#body > main > div.enter-phone > div > h2",
		en: "Please enter your Phone Number",
		hi: "कृपया अपना फोन नंबर दर्ज करें"
	},
	{
		selector: "#NumberWrapper > label",
		en: "Contact Number",
		hi: "संपर्क संख्या"
	},
	{
		selector: "#body > main > div.enter-phone > div > h5",
		en: "* A 4-digit OTP will be sent to your Phone Number",
		hi: "* आपके फोन नंबर पर 4 अंकों का ओटीपी भेजा जाएगा"
	},
	{
		selector: "#OtpWrapper > label",
		en: "OTP",
		hi: "ओटीपी"
	},
	// BUTTONS
	{
		selector: "#Submit",
		en: "SUBMIT",
		hi: "सबमिट "
	},
	{
		selector: "#Resend",
		en: "Re-Send OTP",
		hi: "ओटीपी पुनः भेजें"
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