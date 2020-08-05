<?php

namespace Drupal\debugacademy_react\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Class ReactController.
 */
class ReactController extends ControllerBase {

  /**
   * Embed react app.
   */
  public function content() {
    $page_render_array = [
      '#type' => 'markup',
      '#markup' => '<div id="react-manage"></div>'
    ];
    // Add React Timesheet App to page.
    $page_render_array['#attached']['library'][] = 'debugacademy_react/react-manage';
    return $page_render_array;
  }

}
