RPO Dynamics
============

RPo dynamics data and analysis.


### Getting Started

To get started with RPo Dynamics, first ensure that you have Node.js installed. Second, clone the RPo Dynamics repository. Once cloned, navigate to the directory and install Node modules as specified in the `package.json` file. In the terminal, 

```
$ npm install
```

Next, launch the node application.

```
$ node server.js
```

The application should be listening on PORT 1337. If you have other applications using this port, you can change the port in `app/utils/server.js`.


### Routes

Application routes and their response:

```
http://127.0.0.1:1337/conditions
```

provides a mapping between encoded directory names and their decoded description. For example, encoded key `10001000` corresponds to condition `mutant rpo wt rt antibody none 20ms 0`.

```
http://127.0.0.1:1337/conditions/:id
```

returns a description of the condition set represented by `:id`. For example, id `10001000` returns `mutant rpo wt rt antibody none 20ms 0`.

```
http://127.0.0.1:1337/encoding
```

provides the model underlying encoding-decoding. Included in the model is a description of each model element.


