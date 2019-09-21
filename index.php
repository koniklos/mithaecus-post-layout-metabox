<?php
/*
Plugin Name:  _themename _pluginname
Plugin URI:   
Description:  Adds Layout Metaboxes for _themename
Version:      0.0.1
Author:       Yiannis K.
Author URI:   http://github.com/koniklos
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  _themename-_pluginname
Domain Path:  /languages
*/

// Prevent direct access - If this file is called directly, abort.
// https://tommcfarlin.com/prevent-direct-access-to-your-plugin/
if( !defined('WPINC')) {
	die;
}

include_once( 'includes/metaboxes.php' );