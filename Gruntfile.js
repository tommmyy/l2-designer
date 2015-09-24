module.exports = function(grunt) {
    'use strict';
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bower: {
            install: {
                dest: 'client/requires',
                scss_dest: 'client/styles/sass/',
                css_dest: 'client/styles/css/',
                options: {
                    expand: true,
                    packageSpecific: {
                        'angular-bootstrap-jbruni': {
                            files: [
                                'ui-bootstrap.js',
                                'ui-bootstrap-tpls.js'
                            ]
                        }
                    }
                }
            }
        },

        clean: {
            build: ['build'],
            dev: {
                src: ['build/app.js', 'build/*.css', 'build/<%= pkg.name %>.js']
            },
            prod: ['dist']
        },

        browserify: {
            vendor: {
                src: ['!client/requires/js/**/*.js', 'client/requires/**/*.js'],
                dest: 'build/vendor.js',
                options: {
                    shim: {
                        jquery: {
                            path: 'client/requires/jquery/jquery.js',
                            exports: '$'
                        },
                        angular: {
                            path: 'client/requires/angular/angular.js',
                            exports: 'angular',
                            depends: {
                                jquery: '$'
                            }
                        },
                        'angular-route': {
                            path: 'client/requires/angular-route/angular-route.js',
                            exports: null,
                            depends: {
                                angular: 'angular'
                            }
                        },
                        'angular-resource': {
                            path: 'client/requires/angular-resource/angular-resource.js',
                            exports: null,
                            depends: {
                                angular: 'angular'
                            }
                        },
                        'angular-bootstrap': {
                            path: 'client/requires/angular-bootstrap-jbruni/ui-bootstrap.js',
                            exports: null,
                            depends: {
                                angular: 'angular'
                            }
                        },
                        'angular-bootstrap-tpls': {
                            path: 'client/requires/angular-bootstrap-jbruni/ui-bootstrap-tpls.js',
                            exports: null,
                            depends: {
                                'angular-bootstrap': null
                            }
                        },
                        'bootstrap-contextmenu': {
                            path: 'client/requires/bootstrap-contextmenu/bootstrap-contextmenu.js',
                            exports: null,
                            depends: {
                                'angular-bootstrap': null
                            }
                        },
                        'l2js': {
                            //path: '../L2JS/dist/l2js.js',
                            path: 'node_modules/l2js/dist/l2js.js',
                            exports: 'l2js',
                            depends: {
                                'pixi.js': null
                            }
                        },
                        'pixi.js': {
                            //path: '../L2JS/dist/l2js.js',
                            path: 'node_modules/pixi.js/bin/pixi.min.js',
                            exports: 'PIXI',
                        }
                    }
                }
            },
            app: {
                files: {
                    'build/app.js': ['client/src/main.js']
                },
                options: {
                    transform: ['hbsfy'],
                    external: ['jquery', 'angular', 'angular-route', 'angular-resource', 'angular-bootstrap', 'angular-bootstrap-tpls', 'bootstrap-contextmenu', 'pixi.js', 'l2js']
                }
            }

        },
        compass: {
            init: {
                options: {
                    httpFontsDir: 'fonts',
                    sassDir: 'client/styles/sass',
                    cssDir: 'build/css'
                }
            },
            dev: {
                options: {
                    httpFontsDir: 'fonts',
                    sassDir: 'client/styles/sass',
                    cssDir: 'build/css',
                    watch: true
                }
            },
            prod: {
                options: {
                    fontsDir: 'public/fonts',
                    httpFontsDir: 'fonts',
                    sassDir: 'client/styles/sass',
                    cssDir: 'build/css',
                    environment: 'production'
                }
            }
        },
        concat: {
            'build/<%= pkg.name %>.js': ['build/vendor.js', 'build/app.js']
        },

        copy: {
            dev: {
                files: [{
                    src: 'build/<%= pkg.name %>.js',
                    dest: 'public/js/<%= pkg.name %>.js'
                }, {
                    expand: true,
                    cwd: 'build/',
                    flatten: true,
                    src: 'client/styles/css/**/*.css',
                    dest: 'public/css/'
                }, {
                    src: 'client/img/*',
                    dest: 'public/img/'
                }, {
                    expand: true,
                    cwd: 'bower_components/bootstrap-sass/assets/fonts/',
                    src: '**/*',
                    dest: 'public/fonts/'
                }, {
                    expand: true,
                    cwd: 'client/templates/',
                    flatten: true,
                    src: '*',
                    dest: 'public/templates/'
                }]
            },
            prod: {
                files: [{
                    src: ['client/img/*'],
                    dest: 'dist/img/'
                }]
            }
        },

        // Javascript minification.
        uglify: {
            compile: {
                options: {
                    compress: true,
                    verbose: true
                },
                files: [{
                    src: 'build/<%= pkg.name %>.js',
                    dest: 'dist/js/<%= pkg.name %>.js'
                }]
            }
        },

        // for changes to the front-end code
        watch: {
            css: {
                files: ['build/**/*.css'],
                tasks: ['copy:dev'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            },
            scripts: {
                files: ['client/src/**/*.js'],
                tasks: ['clean:dev', 'browserify:app', 'concat', 'copy:dev'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            },

            templates: {
                files: ['client/templates/*.html'],
                tasks: ['copy:dev'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            }
        },

        // for changes to the node code
        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
                    nodeArgs: ['--debug'],
                    watchedFolders: ['controllers', 'app']
                }
            }
        },

        // mongod server launcher
        shell: {
            mongo: {
                command: 'mongod',
                options: {
                    async: true
                }
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon:dev', 'shell:mongo', 'compass:dev',
                    'watch:scripts', 'watch:css', 'watch:templates'
                ], // watch profiles must be listed, otherwise only last is done
                options: {
                    limit: 8,
                    logConcurrentOutput: true
                }
            },
            test: {
                tasks: ['watch:karma'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'client/src/**/*.js', 'client/spec/**/*.js'],
            dev: ['client/src/**/*.js'],
            test: ['client/spec/**/*.js']
        }
    });

    grunt.registerTask('vendor', ['browserify:vendor', 'concat', 'copy:dev'])

    grunt.registerTask('init', ['clean', 'bower', 'browserify:vendor', 'compass:init']);
    grunt.registerTask('dev', ['clean:dev', 'browserify:app', 'concat', 'copy:dev']);
    grunt.registerTask('prod', ['clean:prod', 'browserify:vendor', 'browserify:app', 'compass:prod', 'concat', 'uglify', 'copy:prod']);
    grunt.registerTask('server', ['dev', 'concurrent:dev']);

    //grunt.registerTask('test', ['test:server', 'test:client']);
    grunt.registerTask('default', ['server']);
};
