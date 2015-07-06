/*!
 *  Gruntfile
 */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };


  var configBridge = grunt.file.readJSON('./configBridge.json', { encoding: 'utf8' });

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
      ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
      ' * Copyright 2015-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
      ' * Licensed under the <%= pkg.license %> license\n' +
      ' */\n',

    // Task configuration.
    clean: {
      dist: configBridge.distlist
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      core: {
        src: ['**/js/*.js','!node_modules/**/*.js','!*.js','!**/js/*.min.js']
      }
    },

    jscs: {
      options: {
        config: '.jscsrc'
      },
      core: {
        src: '<%= jshint.core.src %>'
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>\n',
        stripBanners: false
      },
      core:{
        files: configBridge.jspaths
      }
    },

    uglify: {
      options: {
        compress: {
          warnings: false
        },
        mangle: true,
        preserveComments: 'some'
      },
      core: {
        files: configBridge.jspaths_min
      }
    },

    //    qunit: {
    //      options: {
    //        inject: 'js/tests/unit/phantom.js'
    //      },
    //      files: 'js/tests/index.html'
    //    },

    processhtml: {
      options: {
        data: {
          //message: 'Hello world!'
        }
      },
      dist: {
        files: configBridge.htmlpaths
      }
    },


    //    less: {
    //      compileCore: {
    //        options: {
    //          strictMath: true,
    //          sourceMap: true,
    //          outputSourceFiles: true,
    //          sourceMapURL: '<%= pkg.name %>.css.map',
    //          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
    //        },
    //        src: 'less/bootstrap.less',
    //        dest: 'dist/css/<%= pkg.name %>.css'
    //      },
    //      compileTheme: {
    //        options: {
    //          strictMath: true,
    //          sourceMap: true,
    //          outputSourceFiles: true,
    //          sourceMapURL: '<%= pkg.name %>-theme.css.map',
    //          sourceMapFilename: 'dist/css/<%= pkg.name %>-theme.css.map'
    //        },
    //        src: 'less/theme.less',
    //        dest: 'dist/css/<%= pkg.name %>-theme.css'
    //      }
    //    },
    //

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      core: {
        src: ['**/css/*.css','!node_modules/**/*.css','!*.css']
      }
    },

    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        sourceMap: true,
        advanced: false
      },
      dist: {
        files: configBridge.csspaths_min
      }
    },

    csscomb: {
      options: {
        config: '.csscomb.json'
      },
      dist: {
        files: configBridge.csspaths
      }
    },

    copy:{
      images:{
        files:configBridge.imagespaths
      }
    },
    connect: {
      server: {
        options: {
          port: 3000,
          base: '.'
        }
      }
    },

    //  jekyll: {
    //    options: {
    //      config: '_config.yml'
    //    },
    //    docs: {},
    //    github: {
    //      options: {
    //        raw: 'github: true'
    //      }
    //    }
    //  },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          minifyCSS: true,
          minifyJS: true,
          removeAttributeQuotes: true,
          removeComments: true
        },
        files: configBridge.htmlpaths_min
      }
    },

    htmllint: {
      options: {
        ignore: [
          'Attribute "autocomplete" not allowed on element "button" at this point.',
          'Attribute "autocomplete" not allowed on element "input" at this point.',
          'Element "img" is missing required attribute "src".'
        ]
      },
      files: configBridge.htmlpaths_minlint
    },

    //    watch: {
    //      src: {
    //        files: '<%= jshint.core.src %>',
    //        tasks: ['jshint:core', 'qunit', 'concat']
    //      },
    //      test: {
    //        files: '<%= jshint.test.src %>',
    //        tasks: ['jshint:test', 'qunit']
    //      },
    //      less: {
    //        files: 'less/**/*.less',
    //        tasks: 'less'
    //      }
    //    },

    exec: {
      npmUpdate: {
        command: 'npm update'
      }
    }
  });


  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);

  //    grunt.registerTask('test-js', ['jshint:core', 'jscs:core']);
  grunt.registerTask('test-js', ['jshint:core']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat:core', 'uglify:core']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['csscomb:dist', 'cssmin:dist', 'csslint:core']);

  // HTML distribution task.
  grunt.registerTask('dist-html', ['htmlmin','htmllint' ]);

  // Full distribution task.
  grunt.registerTask('dist', ['clean:dist', 'dist-css', 'processhtml', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['clean:dist','copy:images', 'dist-css','processhtml','htmlmin','dist-js','test-js']);


};
