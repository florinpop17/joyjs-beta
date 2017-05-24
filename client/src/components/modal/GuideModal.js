import React, { Component } from 'react';

import code from './code.png';

class GuideModal extends Component {
    render() {
        return (
            <div className="col-md-12">
                <div id="guideModal" className="modal fade" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title">The Guide</h4>
                            </div>
                            <div className="modal-body">
                                <p>
                                    In the view, you will see two boxes. <br />
                                    You can enter your question in the one on the left, and it will be outputed in the one on the right. <br />
                                    You can use the markdown syntax, and it will be auto-generated in the output box. <br />
                                    Read more about this syntax in this <a rel="noopener noreferrer" href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">cheatsheet</a>. <br />
                                    <br />
                                    If you want to include a code block use the three <strong>```</strong> symbols at the beginning and at the end of your code block. <br />
                                    For an inline code block you can use one <strong>`</strong> around it. <br />
                                    Example code:
                                </p>
                                <img src={code} alt="code" className="img-responsive img-thumbnail"/>
                            </div>
                        </div>
                    </div>
                </div>
                <h4><strong>NOTE:</strong> Before submitting any questions, please make sure you read this <a data-toggle="modal" data-target="#guideModal" className="link">guide</a>.</h4>
            </div>
        )
    }
}

export default GuideModal;
