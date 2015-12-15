
module.exports = (grunt) ->

	# Project configuration.
	grunt.initConfig
		pkg: grunt.file.readJSON('package.json'),
		watch:
			lib:
				files: ["_src/lib/**/*.coffee"]
				tasks: "coffee:lib includereplace".split(" ")

			test:
				files: ["_src/test/**/*.coffee"]
				tasks: "coffee:test"

			pckg:
				files: ["package.json"]
				tasks: "reloadPackage coffee:lib includereplace".split(" ")

		coffee:
			lib:
				expand: true
				cwd: '_src/lib',
				src: ['*.coffee']
				dest: 'lib/'
				ext: '.js'

			test:
				expand: true
				cwd: '_src/test',
				src: ['*.coffee']
				dest: 'test/'
				ext: '.js'

		includereplace:
			pckg:
				options:
					globals:
						version: "<%= pkg.version %>"

					prefix: "@@"
					suffix: ''

				"index.js": ["index.js"]

		mochacli:
			options:
				require: [ "should" ]
				reporter: "spec"
				bail: true
				timeout: 10000

			all: [ "test/test.js" ]

	
	# Default task.
	grunt.loadNpmTasks "grunt-contrib-watch"
	grunt.loadNpmTasks "grunt-contrib-coffee"
	grunt.loadNpmTasks "grunt-include-replace"
	grunt.loadNpmTasks "grunt-mocha-cli"
	grunt.registerTask "reloadPackage", ->
		grunt.config.set "pkg", require("./package.json")
		done = @async()
		done()

	grunt.registerTask "default", "buildall-dev"
	grunt.registerTask "buildall-dev", "coffee includereplace".split(" ")
	grunt.registerTask "test", [ "mochacli" ]
	grunt.registerTask "btest", [ "buildall-dev", "mochacli" ]
