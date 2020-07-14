echo "Deploying site with mock server";

echo -e "\n\n/* ----- Mock Server ----- */\n\n" >> frontend/util.js;
cat frontend/mock-server.js >> frontend/util.js;

echo "Done.";