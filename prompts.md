We're making a new game. It's a 3D coin pusher arcade game. Coins will fall from the top of the screen on to two moving platforms. When they land they'll push other coins, which will cause others to fall from the bottom platform. The goal will be to win coins that fall.

The game should be in TypeScript, react-three-fiber, and rapier physics. The bundler will be Vite. Initialise a new Vite project with the required libraries and set up a good directory structure.

Some requirements are:
- Organised code with assets, hooks, utils, and components in separate directories
- Everything should be typed.
- Physics should be constructed using simple rigid bodies.

---

There are some problems with the app.
- The top shelf is moving left to right. It should be moving back and forth.
- There's a bar along the front of the bottom shelf that will stop coins from falling into the tray.
- The middle shelf isn't deep enough. Coins shouldn't be able to fall off the back.

---

Add a static box above the middle shelf so that as the shelf slides backwards coins are pushed off.

---

The pusher shelf is in the wrong place. It should be nearer the back of the machine.

---

Add a similar pusher to the bottom shelf.

---

Coins are falling a bit too quickly, and too far forwards. Update the app so coins fall about once every 1.5s, just in front of the top level pusher, and in random places along the horizontal axis.

---

(Updated the code to move things into slightly better places manually)