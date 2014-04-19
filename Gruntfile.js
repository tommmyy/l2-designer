module.exports = function(grunt) {

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),

		bower : {
			install : {
				options : {
					targetDir : 'client/requires',
					layout : 'byComponent'
				}
			}
		},

		clean : {
			build : ['build'],
			dev : {
				src : ['build/app.js', 'build/<%= pkg.name %>.css', 'build/<%= pkg.name %>.js']
			},
			prod : ['dist']
		},

		browserify : {
			vendor : {
				src : ['client/requires/**/*.js'],
				dest : 'build/vendor.js',
				options : {
					shim : {
						jquery : {
							path : 'client/requires/jquery/js/jquery.js',
							exports : '$'
						},
						angular : {
							path : 'client/requires/angular/js/angular.js',
							exports : 'angular',
							depends : {
								jquery : '$'
							}
						},
						'angular-route' : {
							path : 'client/requires/angular-route/js/angular-route.js',
							exports : null,
							depends : {
								angular : 'angular'
							}
						},
						'angular-resource' : {
							path : 'client/requires/angular-resource/js/angular-resource.js',
							exports : null,
							depends : {
								angular : 'angular'
							}
						},
						'angular-bootstrap' : {
							path : 'client/requires/angular-bootstrap-jbruni/js/ui-bootstrap.js',
							exports : null,
							depends : {
								angular : 'angular'
							}
						},
						'angular-bootstrap-tpls' : {
							path : 'client/requires/angular-bootstrap-jbruni/js/ui-bootstrap-tpls.js',
							exports : null,
							depends : {
								'angular-bootstrap' : null
							}
						},
						'bootstrap-contextmenu' : {
							path : 'client/requires/bootstrap-contextmenu/js/bootstrap-contextmenu.js',
							exports : null,
							depends : {
								'angular-bootstrap' : null
							}
						},
						'l2js' : {
							path : 'client/requires/l2js/js/l2js.js',
							exports : null
						}
					}
				}
			},
			app : {
				files : {
					'build/app.js' : ['client/src/main.js']
				},
				options : {
					transform : ['hbsfy'],
					external : ['jquery', 'angular', 'angular-route', 'angular-resource', 'angular-bootstrap', 'angular-bootstrap-tpls', 'bootstrap-contextmenu','l2js']
				}
			},
			test : {
				files : {
					'build/tests.js' : ['client/spec/**/*.test.js']
				},
				options : {
					transform : ['hbsfy'],
					external : ['jquery', 'angular', 'angular-route', 'angular-resource', 'angular-bootstrap', 'angular-bootstrap-tpls', 'bootstrap-contextmenu','l2js']
				}
			}
		},

		less : {
			transpile : {
				files : {
					'build/<%= pkg.name %>.css' : ['client/styles/reset.css', 'client/requires/*/css/*', 'client/styles/css/abn-tree.css', 'client/styles/less/main.less']
				}
			}
		},

		concat : {
			'build/<%= pkg.name %>.js' : ['build/vendor.js', 'build/app.js']
		},

		copy : {
			dev : {
				files : [{
					src : 'build/<%= pkg.name %>.js',
					dest : 'public/js/<%= pkg.name %>.js'
				}, {
					src : 'build/<%= pkg.name %>.css',
					dest : 'public/css/<%= pkg.name %>.css'
				}, {
					src : 'client/img/*',
					dest : 'public/img/'
				}, {
					expand : true,
					cwd : 'client/requires/bootstrap/fonts/',
					flatten : true,
					src : '*',
					dest : 'public/fonts/'
				}, {
					expand : true,
					cwd : 'client/templates/',
					flatten : true,
					src : '*',
					dest : 'public/templates/'
				}]
			},
			prod : {
				files : [{
					src : ['client/img/*'],
					dest : 'dist/img/'
				}]
			}
		},

		// CSS minification.
		cssmin : {
			minify : {
				src : ['build/<%= pkg.name %>.css'],
				dest : 'dist/css/<%= pkg.name %>.css'
			}
		},

		// Javascript minification.
		uglify : {
			compile : {
				options : {
					compress : true,
					verbose : true
				},
				files : [{
					src : 'build/<%= pkg.name %>.js',
					dest : 'dist/js/<%= pkg.name %>.js'
				}]
			}
		},

		// for changes to the front-end code
		watch : {
			scripts : {
				files : ['client/src/**/*.js'],
				tasks : ['clean:dev', 'browserify:app', 'concat', 'copy:dev']
			},
			templates : {
				files : ['client/templates/*.html'],
				tasks : ['copy:dev']
			},
			less : {
				files : ['client/styles/**/*.less'],
				tasks : ['less:transpile', 'copy:dev']
			},
			test : {
				files : ['build/app.js', 'client/spec/**/*.test.js'],
				tasks : ['browserify:test']
			},
			karma : {
				files : ['build/tests.js'],
				tasks : ['jshint:test', 'karma:watcher:run']
			}
		},

		// for changes to the node code
		nodemon : {
			dev : {
				options : {
					file : 'server.js',
					nodeArgs : ['--debug'],
					watchedFolders : ['controllers', 'app'],
					env : {
						PORT : '3300'
					}
				}
			}
		},

		// server tests
		simplemocha : {
			options : {
				globals : ['expect', 'sinon'],
				timeout : 3000,
				ignoreLeaks : false,
				ui : 'bdd',
				reporter : 'spec'
			},

			server : {
				src : ['spec/spechelper.js', 'spec/**/*.test.js']
			}
		},

		// mongod server launcher
		shell : {
			mongo : {
				command : 'mongod',
				options : {
					async : true
				}
			}
		},

		concurrent : {
			dev : {
				tasks : ['nodemon:dev', 'shell:mongo', 'watch:scripts', 'watch:templates', 'watch:less', 'watch:test'],
				options : {
					logConcurrentOutput : true
				}
			},
			test : {
				tasks : ['watch:karma'],
				options : {
					logConcurrentOutput : true
				}
			}
		},

		// for front-end tdd
		karma : {
			options : {
				configFile : 'karma.conf.js'
			},
			watcher : {
				background : true,
				singleRun : false
			},
			test : {
				singleRun : true
			}
		},

		jshint : {
			all : ['Gruntfile.js', 'client/src/**/*.js', 'client/spec/**/*.js'],
			dev : ['client/src/**/*.js'],
			test : ['client/spec/**/*.js']
		}
	});

	grunt.registerTask('init:dev', ['clean', 'bower', 'browserify:vendor']);

	grunt.registerTask('build:dev', ['clean:dev', 'browserify:app', 'browserify:test', 'jshint:dev', 'less:transpile', 'concat', 'copy:dev']);
	grunt.registerTask('build:prod', ['clean:prod', 'browserify:vendor', 'browserify:app', 'jshint:all', 'less:transpile', 'concat', 'cssmin', 'uglify', 'copy:prod']);

	grunt.registerTask('heroku', ['init:dev', 'build:dev']);

	grunt.registerTask('server', ['build:dev', 'concurrent:dev']);
	grunt.registerTask('test:server', ['simplemocha:server']);

	grunt.registerTask('test:client', ['karma:test']);
	grunt.registerTask('tdd', ['karma:watcher:start', 'concurrent:test']);

	grunt.registerTask('test', ['test:server', 'test:client']);
};
