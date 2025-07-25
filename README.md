# Schedule Snake
A web application built to ensure a smooth enrollment process into university courses. 
Professors are able to create courses on Schedule Snake swiftly, and students are able to
enroll into courses that those professors create for the corresponding university. 
Schedule Snake is powered by NextJS & MySQL database hosted on PhpMyAdmin</br>

### Demo

![schedule_snake.gif](public%2Fschedule_snake.gif)

### Purpose 

Schedule Snake demonstrates MySQL's reliability as a high-performing relational database through an
application that relies on data consistency due to the involvement of certain features including verifying proper enrollment.
Schedule Snake is built to be robust and user friendly, and an expression of what students wished 
for CUNY's Schedule Builder to be closer to.

### How to setup 

Ensure Git & Node.js are installed on your computer. Clone the repository:
```
# clone Schedule Snake
$ git clone https://github.com/jaynopponep/schedule-snake.git

# change directory to schedule snake
$ cd schedule-snake

# install dependencies
$ npm install

# run the development server
$ npm run dev
```
After this, you should be able to run the application on your localhost since this project
is already connected to the PhpMyAdmin server. Note the password for DB connection must be directly retrieved.

### Use Cases

- Course creation by professors 
- Proper student enrollment (no time conflicts, no overbooking, confirming seat availability)
- Course management
- Course withdrawal, consistently updated in real time
- Account management

### Limitations

We have successfully implemented a minimum viable product for this project; however, 
has minor limitations on features that can be fixed or enhanced in the future. Some of these would
include that passwords are not decrypted when signing up, the use of cookies instead of localStorage
in order to persist cart and login status, and having access to different universities and only those.

### Contributors
<a href="https://github.com/jaynopponep">
  <img src="https://github.com/jaynopponep.png?size=100" width="100" height="100" style="border-radius: 50%;" alt="Jay Noppone P" />
</a>
<a href="https://github.com/willofcode">
  <img src="https://github.com/willofcode.png?size=100" width="100" height="100" style="border-radius: 50%;" alt="William Ng" />
</a>
<a href="https://github.com/MattMunoz">
  <img src="https://github.com/MattMunoz.png?size=100" width="100" height="100" style="border-radius: 50%;" alt="Matthew Munoz" />
</a>
<a href="https://github.com/BaljinderHothi">
  <img src="https://github.com/BaljinderHothi.png?size=100" width="100" height="100" style="border-radius: 50%;" alt="Baljinder Hothi" />
</a>
