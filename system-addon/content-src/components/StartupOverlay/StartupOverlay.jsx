import {FormattedMessage, injectIntl} from "react-intl";
import {actionCreators as ac} from "common/Actions.jsm";
import {connect} from "react-redux";
import React from "react";

export class _StartupOverlay extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.clickSkip = this.clickSkip.bind(this);
    this.initScene = this.initScene.bind(this);
    this.removeOverlay = this.removeOverlay.bind(this);

    this.state = {emailInput: ""};
    this.initScene();
  }

  initScene() {
    // Timeout to allow the scene to render once before attaching the attribute
    // to trigger the animation.
    setTimeout(() => {
      this.setState({show: true});
    }, 10);
  }

  removeOverlay() {
    window.removeEventListener("visibilitychange", this.removeOverlay);
    this.setState({show: false});
    setTimeout(() => {
      // Allow scrolling and fully remove overlay after animation finishes.
      document.body.classList.remove("welcome");
    }, 400);
  }

  onInputChange(e) {
    this.setState({emailInput: e.target.value});
  }

  onSubmit() {
    this.props.dispatch(ac.UserEvent({event: "SUBMIT_EMAIL"}));
    window.addEventListener("visibilitychange", this.removeOverlay);
  }

  clickSkip() {
    this.props.dispatch(ac.UserEvent({event: "SKIPPED_SIGNIN"}));
    this.removeOverlay();
  }

  render() {
    let termsLink = (<a href="https://accounts.firefox.com/legal/terms" target="_blank" rel="noopener noreferrer"><FormattedMessage id="firstrun_terms_of_service" /></a>);
    let privacyLink = (<a href="https://accounts.firefox.com/legal/privacy" target="_blank" rel="noopener noreferrer"><FormattedMessage id="firstrun_privacy_notice" /></a>);
    return (
      <div className={`overlay-wrapper ${this.state.show ? "show " : ""}`}>
        <div className="background" />
        <div className="firstrun-scene">
          <div className="fxaccounts-container">
            <div className="firstrun-left-divider">
              <h1 className="firstrun-title"><FormattedMessage id="firstrun_title" /></h1>
              <p className="firstrun-content"><FormattedMessage id="firstrun_content" /></p>
              <a className="firstrun-link" href="https://www.mozilla.org/firefox/features/sync/" target="_blank" rel="noopener noreferrer"><FormattedMessage id="firstrun_learn_more_link" /></a>
            </div>
            <div className="firstrun-sign-in">
              <p className="form-header"><FormattedMessage id="firstrun_form_header" /><span><FormattedMessage id="firstrun_form_sub_header" /></span></p>
              <form method="get" action="https://accounts.firefox.com?entrypoint=activity-stream-firstrun&utm_source=activity-stream&utm_campaign=firstrun" target="_blank" rel="noopener noreferrer" onSubmit={this.onSubmit}>
                <input name="service" type="hidden" value="sync" />
                <input name="action" type="hidden" value="email" />
                <input name="context" type="hidden" value="fx_desktop_v3" />
                <input className="email-input" name="email" type="email" required="true" placeholder={this.props.intl.formatMessage({id: "firstrun_email_input_placeholder"})} onChange={this.onInputChange} />
                <div className="extra-links">
                  <FormattedMessage
                    id="firstrun_extra_legal_links"
                    values={{
                      terms: termsLink,
                      privacy: privacyLink
                    }} />
                </div>
                <button className="continue-button" type="submit"><FormattedMessage id="firstrun_continue_to_login" /></button>
              </form>
              <button className="skip-button" disabled={!!this.state.emailInput} onClick={this.clickSkip}><FormattedMessage id="firstrun_skip_login" /></button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const StartupOverlay = connect()(injectIntl(_StartupOverlay));
