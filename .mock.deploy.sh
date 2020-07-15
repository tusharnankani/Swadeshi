echo "Deploying site with mock server";

if [ -d "frontend" ]; then
	cd frontend;
fi;

echo -e "\n\n\n/* ----- Mock Server ----- */\n\n\n" >> util.js;
cat mock-server.js >> util.js;

echo "Done.";