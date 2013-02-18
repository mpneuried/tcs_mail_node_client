var proc = require('child_process');

module.exports = function(grunt) {

	// you execute "$ [sudo] gem install terminal-notifier" before using this
	// https://github.com/alloy/terminal-notifier
	function showNotif(type, msg) {
		var title = 'Grunt building task';
		var activateId = null;
		var output = null;
		if(type === 'ok') {
			msg = 'all tasks are done.';
		} else {
			activateId = ' -activate "com.apple.Terminal"';
		}
		output = ['terminal-notifier ', '-message "', msg, '" -title "', title, (type !== 'ok') ? '" -subtitle "' + type : '', '" -group ', type, activateId].join('');
		proc.exec(output);
	}

	grunt.utils.hooker.hook(grunt, 'initConfig', {
		once: true,
		post: function() {
			grunt.utils.hooker.hook(grunt.log, 'write', function(msg) {
				msg = grunt.log.uncolor(msg);
				if(msg.match(/^Done,/)) {
					showNotif('ok');
				}
			});
			grunt.utils.hooker.hook(grunt.fail, 'warn', function(error) {
				if(typeof error !== 'undefined') {
					showNotif('warn', error.message);
				}
			});
			grunt.utils.hooker.hook(grunt.fail, 'error', function(msg) {
				console.log(msg);
				if(typeof msg === 'string') {
					showNotif('error', 'error');
				}
			});
			grunt.utils.hooker.hook(grunt.log, 'ok', function(msg) {
				if(typeof msg === 'string') {
					showNotif('ok');
				}
			});
		}
	});


	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		watch: {
			lib:{
				files: [ "_src/lib/**/*.coffee" ],
				tasks: 'coffee:lib replace'		
			},
			test:{
				files: [ "_src/test/**/*.coffee" ],
				tasks: 'coffee:test'		
			},
			pckg: {
				files: [ "package.json" ],
				tasks: 'reloadPackage coffee:lib replace'
			}

		},
		coffee: {
			lib: {
				files: {
					'lib/*.js': [
						"_src/lib/*.coffee"
					]
				}
			},
			test: {
				files: {
					'test/*.js': [
						"_src/test/*.coffee"
					]
				}
			},
			options: {
				flatten: false,
				bare: false
			}
		},
		replace: {
			dist: {
				options: {
					variables: {
						'version': "<%= pkg.version %>"
					},
					prefix: '@@'
				},
				files: {
					'lib/': ['lib/index.js']
				}
			}
		}
	});
	
	// Default task.
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-replace');

	grunt.registerTask( "reloadPackage", function(){
		grunt.config.set( "pkg", require('./package.json') )
		var done = this.async();
		done()
	} )
	
	grunt.registerTask('default', 'buildall-dev');

	grunt.registerTask( "buildall-dev", "coffee replace");

};