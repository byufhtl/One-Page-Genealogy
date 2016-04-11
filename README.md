
----------------------------------------------------
Instructions for One Page Genealogy Development
----------------------------------------------------


WebStorm is the recommended IDE for development with typescript.
You can get a free student jetbrains account to use WebStorm for free.



To compile the code, run the following command from the root "opg" directory:

	find . -name "*.ts" | xargs tsc

You will need to install typescript version 1.6 using the following command to compile successfully:

	sudo npm -g install typescript@1.6

In WebStorm settings, you'll also need to set the compiler for typescript to version 1.6.
	
To use the development site, run the following command from the root "opg" directory:

	python -m SimpleHTTPServer
	
Then navigate to localhost:8000 in a browser.
