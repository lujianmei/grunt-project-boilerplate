module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build:{
        src: ["2015-07-02-wajuejihuodong/dist/**/*.*"]
      }

      //release: ["path/to/another/dir/one", "path/to/another/dir/two"]
    },

    //对html进行内容替换，替换其中的多个js, css文件为一个，即合并后的文件名称
    processhtml: {
      options: {
        data: {
          //message: 'Hello world!'
        }
      },
      dist: {
        files: {
          '2015-07-02-wajuejihuodong/dist/index.html': ['2015-07-02-wajuejihuodong/index.html'],
          '2015-07-02-wajuejihuodong/dist/test.html': ['2015-07-02-wajuejihuodong/test.html'],
          '2015-07-04-jianjigaiban/dist/index.html': ['2015-07-04-jianjigaiban/index.html'],
          '2015-07-04-jianjigaiban/dist/test.html': ['2015-07-04-jianjigaiban/test.html']
        }
      }
    },

    // 对多个js文件进行合并，新建一个目录后需要修改
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        //separator: ';'
      },
      concat_all:{
        files: {
          //挖掘机活动配置 dist : src
          '2015-07-02-wajuejihuodong/dist/js/index.js': ['2015-07-02-wajuejihuodong/js/*.js'],
          //剪辑改版配置
          '2015-07-04-jianjigaiban/dist/js/index.js': ['2015-07-04-jianjigaiban/js/*.js']
        }
      }
    },

    //对代码进行规范性检查，新建一个目录后不需要修改
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: false
        }
      },
      files: ['Gruntfile.js','2015-07-02-wajuejihuodong/dist/js/*.js','2015-07-04-jianjigaiban/dist/js/*.js']
    },

    // 对js代码进行压缩
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      target: {
        files: {
          '2015-07-02-wajuejihuodong/dest/js/index.min.js': ['2015-07-02-wajuejihuodong/js/index.js'],
          '2015-07-04-jianjigaiban/dest/js/index.min.js': ['2015-07-04-jianjigaiban/js/index.js']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // 清理文件
  grunt.registerTask(
    'clean',
    'Compiles the JavaScript files.',
    [ 'jshint:core', 'uglify:dynamic_mappings' ]
  );


  // 处理publicjs
  grunt.registerTask(
    'publicJs',
    'Compiles the JavaScript files.',
    [ 'jshint:core', 'uglify:dynamic_mappings' ]
  );


  // 默认执行任务
  grunt.registerTask(
    'default',    //任务名称
    'Compiles all of the assets and copies the files to the build directory.',   //任务描述
    [ 'clean', 'concat', 'processhtml', 'uglify' ]    //将要运行的任务数组，按顺序执行
  );
  // 创建工程
  grunt.registerTask(
    'build',    //任务名称
    'Compiles all of the assets and copies the files to the build directory.',   //任务描述
    [ 'clean', 'concat', 'processhtml', 'uglify' ]    //将要运行的任务数组，按顺序执行
  );


};
