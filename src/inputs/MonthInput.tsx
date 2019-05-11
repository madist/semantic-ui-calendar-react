import invoke from 'lodash/invoke';
import moment, { Moment } from 'moment';
import * as React from 'react';

import MonthPicker, {
  MonthPickerOnChangeData,
} from '../pickers/monthPicker/MonthPicker';
import InputView from '../views/InputView';
import BaseInput, {
  BaseInputProps,
  BaseInputPropTypes,
  BaseInputState,
  DateRelatedProps,
  DateRelatedPropTypes,
  DisableValuesProps,
  DisableValuesPropTypes,
  MinMaxValueProps,
  MinMaxValuePropTypes,
} from './BaseInput';
import {
  parseArrayOrValue,
  parseValue,
  buildValue,
  dateValueToString,
  pickInitialDate,
} from './parse';

import {
  MonthView,
  MonthViewProps,
} from '../views';

export type MonthInputProps =
  & BaseInputProps
  & DateRelatedProps
  & DisableValuesProps
  & MinMaxValueProps;

export type MonthInputOnChangeData = MonthInputProps;

class MonthInput extends BaseInput<MonthInputProps, BaseInputState> {
  public static readonly defaultProps = {
    ...BaseInput.defaultProps,
    dateFormat: 'MMM',
    icon: 'calendar',
  };

  public static readonly propTypes = Object.assign({},
    BaseInputPropTypes,
    DateRelatedPropTypes,
    DisableValuesPropTypes,
    MinMaxValuePropTypes,
  );

  constructor(props) {
    super(props);
    this.state = {
      popupIsClosed: true,
    };
  }

  public render() {
    const {
      value,
      dateFormat,
      localization,
    } = this.props;

    return (
      <InputView
        { ...this.getUnusedProps() }
        popupIsClosed={this.state.popupIsClosed}
        value={dateValueToString(value, dateFormat, localization)}
        onMount={this.onInputViewMount}
        closePopup={this.closePopup}
        openPopup={this.openPopup}
        renderPicker={this.getPicker}
      />
    );
  }

  protected getUnusedProps = () => {
    // TODO: automate unused props extraction
    const {
      value,
      dateFormat,
      initialDate,
      disable,
      maxDate,
      minDate,
      closable,
      localization,
      ...rest
    } = this.props;

    return rest;
  }

  protected parseInternalValue(): Moment {
    const {
      value,
      localization,
      dateFormat,
    } = this.props;
    
    return buildValue(value, null, localization, dateFormat, null);
  }

  private getPicker = () => {
    const {
      value,
      dateFormat,
      disable,
      maxDate,
      minDate,
      localization,
    } = this.props;

    return (
      <MonthPicker
        inline={this.props.inline}
        isPickerInFocus={this.isPickerInFocus}
        isTriggerInFocus={this.isTriggerInFocus}
        onCalendarViewMount={this.onCalendarViewMount}
        closePopup={this.closePopup}
        hasHeader={false}
        onChange={this.handleSelect}
        initializeWith={pickInitialDate({ ...this.props, value: this.parseInternalValue() })}
        value={buildValue(value, null, localization, dateFormat, null)}
        disable={parseArrayOrValue(disable, dateFormat, localization)}
        maxDate={parseValue(maxDate, dateFormat, localization)}
        minDate={parseValue(minDate, dateFormat, localization)}
        localization={localization}
        onHeaderClick={() => undefined}
        renderView={this.getMonthView}
      />
    );
  }

  private getMonthView = (monthViewProps: MonthViewProps) => {

    return (
      <MonthView
        { ...this.getUnusedProps() }
        { ...monthViewProps }
        localization={this.props.localization} />
    );
  }

  private handleSelect = (e: React.SyntheticEvent<HTMLElement>,
                          { value }: MonthPickerOnChangeData) => {
    const { localization } = this.props;
    const date = localization ? moment({ month: value.month }).locale(localization) : moment({ month: value.month });
    let output = '';
    if (date.isValid()) {
      output = date.format(this.props.dateFormat);
    }
    invoke(
      this.props,
      'onChange',
      e, { ...this.props, value: output });
    if (this.props.closable) {
      this.closePopup();
    }
  }
}

export default MonthInput;
