var attire = require('attire');

module.exports = function(grunt) {

    grunt.initConfig({

        uglify: {
            min: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '**/*.js',
                    dest: 'dist',
                    ext: '.min.js'
                }]
            }
        },

        copy: {
            jsFiles: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.js'],
                    dest: 'dist'
                }]
            }
        },

        eslint: {
            options: {
                configFile: '.eslintrc.js'
            },
            target: [
                ['src/**/*.js'],
                'Gruntfile.js'
            ]
        },

        watch: {
            jsFiles: {
                expand: true,
                files: ['src/**/*.js'],
                tasks: ['eslint', 'uglify', 'copy'],
                options: {
                    spawn: false
                }
            },
            readme: {
                expand: true,
                files: ['README.md'],
                tasks: ['buildDemo'],
                options: {
                    spawn: false
                }
            },
        },

        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                commitFiles: ['package.json', 'bower.json'],
                tagName: '%VERSION%',
                push: false
            }
        }

    });

    grunt.registerTask('buildDemo', function() {

        var done = this.async();

        attire.buildDemo({
            file: 'README.md',
            dest: 'index.html',
            title: 'JSON api normalize',
            description: 'Normalize JSON api dataset',
            canonicalUrl: 'http://dbrekalo.github.io/json-api-normalize/',
            githubUrl: 'https://github.com/dbrekalo/json-api-normalize',
            userRepositories: {
                user: 'dbrekalo',
                onlyWithPages: true
            },
            author: {
                caption: 'Damir Brekalo',
                url: 'https://github.com/dbrekalo',
                image: 'https://s.gravatar.com/avatar/32754a476fb3db1c5a1f9ad80c65d89d?s=80',
                email: 'dbrekalo@gmail.com',
                github: 'https://github.com/dbrekalo',
                twitter: 'https://twitter.com/dbrekalo'
            },
            afterParse: function($) {
                $('p').first().remove();
                $('a').first().parent().remove();
            },
            inlineCss: true,
        }).then(function() {
            done();
            grunt.log.ok(['Demo builded']);
        });

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['build', 'watch']);
    grunt.registerTask('build', ['eslint', 'uglify', 'copy', 'buildDemo']);

};
