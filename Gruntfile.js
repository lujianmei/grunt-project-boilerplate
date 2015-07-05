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

  var fs = require('fs');
  var path = require('path');
  var npmShrinkwrap = require('npm-shrinkwrap');
  var configBridge = grunt.file.readJSON('./configBridge.json', { encoding: 'utf8' });

  Object.keys(configBridge.paths).forEach(function (key) {
    configBridge.paths[key].forEach(function (val, i, arr) {
      arr[i] = path.join('./docs/assets', val);
    });
  });

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2015-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under the <%= pkg.license %> license\n' +
            ' */\n',
    jqueryCheck: configBridge.config.jqueryCheck.join('\n'),
    jqueryVersionCheck: configBridge.config.jqueryVersionCheck.join('\n'),

    // Task configuration.
    clean: {
      dist: '**/dist'
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
        banner: '<%= banner %>\n<%= jqueryCheck %>\n<%= jqueryVersionCheck %>',
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
        files: configBridge.jspaths_dist
        }
    },

//    qunit: {
//      options: {
//        inject: 'js/tests/unit/phantom.js'
//      },
//      files: 'js/tests/index.html'
//    },

    //对html进行内容替换，替换其中的多个js, css文件为一个，即合并后的文件名称
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
        files: configBridge.csspaths_dist
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
//    copy: {
//      fonts: {
//        expand: true,
//        src: 'fonts/*',
//        dest: 'dist/'
//      }
//      docs: {
//        expand: true,
//        cwd: 'dist/',
//        src: [
//          '**/*'
//        ],
//        dest: 'docs/dist/'
//      }
//    },

    connect: {
      server: {
        options: {
          port: 3000,
          base: '.'
        }
      }
    },

    jekyll: {
      options: {
        config: '_config.yml'
      },
      docs: {},
      github: {
        options: {
          raw: 'github: true'
        }
      }
    },

//    htmlmin: {
//      dist: {
//        options: {
//          collapseWhitespace: true,
//          conservativeCollapse: true,
//          minifyCSS: true,
//          minifyJS: true,
//          removeAttributeQuotes: true,
//          removeComments: true
//        },
//        expand: true,
//        cwd: '_gh_pages',
//        dest: '_gh_pages',
//        src: [
//          '**/*.html',
//          '!examples/**/*.html'
//        ]
//      }
//    },

//    jade: {
//      options: {
//        pretty: true,
//        data: getLessVarsData
//      },
//      customizerVars: {
//        src: 'docs/_jade/customizer-variables.jade',
//        dest: 'docs/_includes/customizer-variables.html'
//      },
//      customizerNav: {
//        src: 'docs/_jade/customizer-nav.jade',
//        dest: 'docs/_includes/nav/customize.html'
//      }
//    },

//    htmllint: {
//      options: {
//        ignore: [
//          'Attribute "autocomplete" not allowed on element "button" at this point.',
//          'Attribute "autocomplete" not allowed on element "input" at this point.',
//          'Element "img" is missing required attribute "src".'
//        ]
//      },
//      src: '_gh_pages/**/*.html'
//    },

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

//    sed: {
//      versionNumber: {
//        pattern: (function () {
//          var old = grunt.option('oldver');
//          return old ? RegExp.quote(old) : old;
//        })(),
//        replacement: grunt.option('newver'),
//        exclude: [
//          'dist/fonts',
//          'docs/assets',
//          'fonts',
//          'js/tests/vendor',
//          'node_modules',
//          'test-infra'
//        ],
//        recursive: true
//      }
//    },
//
//    'saucelabs-qunit': {
//      all: {
//        options: {
//          build: process.env.TRAVIS_JOB_ID,
//          throttled: 10,
//          maxRetries: 3,
//          maxPollRetries: 4,
//          urls: ['http://127.0.0.1:3000/js/tests/index.html?hidepassed'],
//          browsers: grunt.file.readYAML('grunt/sauce_browsers.yml')
//        }
//      }
//    },

    exec: {
      npmUpdate: {
        command: 'npm update'
      }
    }

//    compress: {
//      main: {
//        options: {
//          archive: 'bootstrap-<%= pkg.version %>-dist.zip',
//          mode: 'zip',
//          level: 9,
//          pretty: true
//        },
//        files: [
//          {
//            expand: true,
//            cwd: 'dist/',
//            src: ['**'],
//            dest: 'bootstrap-<%= pkg.version %>-dist'
//          }
//        ]
//      }
//    }
//
  });


  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);

  // Docs HTML validation task
//  grunt.registerTask('validate-html', ['jekyll:docs', 'htmllint']);

//    grunt.registerTask('test-js', ['jshint:core', 'jscs:core']);
    grunt.registerTask('test-js', ['jshint:core']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat:core', 'uglify:core']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['csscomb:dist', 'cssmin:dist', 'csslint:core']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean:dist', 'dist-css', 'processhtml', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['clean:dist','copy:images', 'dist-css','processhtml','dist-js','test-js']);

  // Docs task.
//  grunt.registerTask('docs-css', ['autoprefixer:docs', 'autoprefixer:examples', 'csscomb:docs', 'csscomb:examples', 'cssmin:docs']);
//  grunt.registerTask('lint-docs-css', ['csslint:docs', 'csslint:examples']);
//  grunt.registerTask('docs-js', ['uglify:docsJs', 'uglify:customize']);
//  grunt.registerTask('lint-docs-js', ['jshint:assets', 'jscs:assets']);
//  grunt.registerTask('docs', ['docs-css', 'lint-docs-css', 'docs-js', 'lint-docs-js', 'clean:docs', 'copy:docs', 'build-glyphicons-data', 'build-customizer']);

//  grunt.registerTask('prep-release', ['dist', 'docs', 'jekyll:github', 'htmlmin', 'compress']);

};
