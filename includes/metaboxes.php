<?php

function _themename_post_layout_add_meta_box() {
	add_meta_box( 
		'_themename_post_metabox', 
		esc_html__( 'Layout Settings', '_themename-_pluginname' ), 
		'_themename_post_layout_meta_box_html', 
		array( 'post' , '_themename_recipe'), 
		'side', 
		'default',
		array(
			'__block_editor_compatible_meta_box' => true,
			'__back_compat_meta_box'             => false,
		)
	);
}

add_action( 'add_meta_boxes', '_themename_post_layout_add_meta_box' );

function _themename_post_layout_meta_box_html( $post ) {
	$layout = get_post_meta($post->ID, '__themename_post_layout', true);
	wp_nonce_field( '_themename_post_layout_update', '_themename_post_layout_nonce' );
	?>
	<p>
		<label for="_themename_post_layout_field"><?php esc_html_e( 'Layout', '_themename-_pluginname' ); ?></label>
		<select name="_themename_post_layout_field" id="_themename_post_layout_field" class="widefat">
			<option <?php selected( $layout, 'full' ); ?> value="full"><?php esc_html_e( 'Full Width', '_themename-_pluginname' ); ?></option>
			<option <?php selected( $layout, 'sidebar' ); ?> value="sidebar"><?php esc_html_e( 'Post With Sidebar', '_themename-_pluginname' ); ?></option>
		</select>
	</p>
	<?php
}

function _themename_post_layout_meta_box_save( $post_id, $post ) {
	$can_edit = get_post_type_object( $post->post_type )->cap->edit_post;
	
	if( !current_user_can( $can_edit, $post_id )) {
		return;
	}
	
	if( !isset( $_POST['_themename_post_layout_nonce']) || !wp_verify_nonce( $_POST['_themename_post_layout_nonce'], '_themename_post_layout_update' )) {
		return;
	}
	
	if( array_key_exists('_themename_post_layout_field', $_POST) ) {
		update_post_meta( 
			$post_id, 
			'__themename_post_layout', 
			sanitize_text_field($_POST['_themename_post_layout_field'])
		);
	}
}

add_action( 'save_post', '_themename_post_layout_meta_box_save', 10, 2 );