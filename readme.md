This is practise assessment for my Software Development class in highschool. This application has very little practical use and being here probably won't interest you.

![carpet capers adam mcarthur](http://imgkk.com/i/5kx9.png "Carpet Capers")

### App Info

This application is written in [Ruby](https://www.ruby-lang.org) & JavaScript, using a lightweight DSL called [Sinatra](http://www.sinatrarb.com) to add web application functionality. It's only other dependancies are [jtask](https://github.com/adammcarthur/jtask), a JSON text file database I created myself a few months back, and [Erubis](http://www.kuwata-lab.com/erubis) - a templating language to render the "GUI"/view files.

You can find the case study in [instructions.md](https://github.com/adammcarthur/carpet-capers/blob/master/instructions.md).

View the application on the web: http://carpet-capers.herokuapp.com/

### To Run This Application On Your Computer:

- **Windows Users Only:** Install the ruby language on your computer [from this website](http://rubyinstaller.org/downloads). Ensure the installer appends ruby to your environment variables in the latter stages of the installation.
- Download this repository to your desktop.
- Open up terminal/command prompt, and `cd` to the desktop location on your computer.
- Type in `gem install bundler`.
- Then use `bundle install` to install the dependancies for this project.
- Finally, start the web server by typing in `rackup`.

If you have followed these steps correctly, you should be able to view this application in your web browser (ie Google Chrome, Mozilla) at the address `http://localhost:9292`.

![codeship](https://www.codeship.io/projects/0c3cebd0-b36a-0131-4213-227d03ec1668/status "Codeship Status")
