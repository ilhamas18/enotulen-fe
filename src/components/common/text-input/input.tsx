import { TouchEventHandler } from "react";
import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import ReactSelect from "react-select"
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai"

interface type {
  id: string;
  type?: string;
  name?: string;
  center?: boolean;
  placeholder?: string;
  label?: string;
  max?: number;
  value?: any;
  anim?: boolean;
  errors?: any;
  change?: any;
  setValueSelected?: any;
  touched?: any,
  handleFocus?: any,
  handleBlur?: any;
  options?: any;
  hideCopy?: boolean;
  disabled?: boolean;
  variant?: string;
  onClick?: any;
}

const TextInput = ({
  id,
  type,
  name,
  center,
  placeholder,
  label,
  max,
  value,
  errors,
  change,
  setValueSelected,
  touched,
  handleFocus,
  handleBlur,
  options,
  hideCopy,
  disabled,
  variant,
  onClick,
}: type) => {
  const [iconAye, setIconAye] = useState(false)

  return (
    <div className="form">
      {type === "text" || type === "number" || type === "tel" || type === "date" ? (
        <input
          type={type}
          onKeyPress={(event) => {
            if (type == "tel") {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }
          }}
          id={id}
          name={name}
          maxLength={max}
          value={value ?? ""}
          className={`
           ${variant == "secondary" ? "form__input_secondary" : "form__input"} 
           ${errors && touched ? "error" : ""} 
           ${center ? "center text-center tracking-widests font-Bold" : ""} `
          }
          pattern="[a-zA-Z0-9.,\s]+"
          onFocus={handleFocus}
          placeholder={`${placeholder ? placeholder : " "}`}
          autoComplete="off"
          onPaste={(e: any) => {
            if (hideCopy) {
              e.preventDefault();
              return false;
            }
          }}
          onCopy={(e: any) => {
            if (hideCopy) {
              e.preventDefault();
              return false;
            }
          }}
          onBlur={handleBlur}
          min={0}
          onWheel={(e: any) => {
            if (type == "number") {
              e.target.blur();
            }
          }}
          onChange={change}
          disabled={disabled}
          onClick={onClick}
        />
      ) : null}
      {type === "password" && (
        <>
          <input
            type={iconAye ? "text" : "password"}
            id={id}
            name={name}
            maxLength={max}
            value={value ?? ""}
            className={`dark:bg-white
              ${variant == "secondary" ? "form__input_secondary" : "form__input"} 
              ${errors ? "error" : ""} 
              ${center ? "center text-center tracking-widests font-Bold" : ""} `
            }
            pattern="[a-zA-Z0-9.,\s]+"
            onFocus={handleFocus}
            placeholder={`${placeholder ? placeholder : " "}`}
            autoComplete="off"
            onPaste={(e: any) => {
              if (hideCopy) {
                e.preventDefault();
                return false;
              }
            }}
            onCopy={(e: any) => {
              if (hideCopy) {
                e.preventDefault();
                return false;
              }
            }}
            onBlur={handleBlur}
            min={0}
            onChange={change}
            disabled={disabled}
            onClick={onClick}
          />
          <div
            className={`${type === 'password' ? 'block' : 'hidden'} flex absolute top-3 right-2`}
            onClick={() => setIconAye(!iconAye)}
            role="presentation"
          >
            {iconAye ? (
              <AiFillEyeInvisible size={20} />
            ) : (
              <AiFillEye size={20} />
            )}
          </div>
        </>
      )}
      {type === "text-area" && (
        <textarea
          id={id}
          name={name}
          maxLength={max}
          value={value ?? ""}
          className={`
           form__input-text-area
           ${errors && touched ? "error" : ""} 
           ${center ? "center text-center tracking-widests font-Bold" : ""} `
          }
          onInvalid={(e: any) => {
            e.target.setCustomValidity("Hanya dapat memasukan huruf dan angka");
          }}
          onFocus={handleFocus}
          placeholder={`${placeholder ? placeholder : " "}`}
          autoComplete="off"
          onPaste={(e: any) => {
            if (hideCopy) {
              e.preventDefault();
              return false;
            }
          }}
          onCopy={(e: any) => {
            if (hideCopy) {
              e.preventDefault();
              return false;
            }
          }}
          onBlur={handleBlur}
          rows={5}
          onChange={change}
          disabled={disabled}
          onClick={onClick}
        />
      )}
      {type !== "date-time" && type !== "time" && (
        label && (
          <label
            htmlFor={name}
            className={` ${type === "text-area" ? "form__label_textarea" : "form__label"}  ${errors ? "error" : ""} font-Museo-Light`}
          >
            {label}
          </label>
        )
      )}
      {type == "dropdown" && (
        <ReactSelect
          id={name}
          instanceId={name}
          options={options}
          name={name}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={change}
          placeholder={placeholder}
          isDisabled={disabled}
          className={` ${errors && touched ? "error" : ""}`}
        />
      )}
      {type === "date-picker" && (
        <div style={{ width: '100%' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={label}
              value={value}
              onChange={change}
              disabled={disabled}
            />
          </LocalizationProvider>
        </div>
      )}
      {type === "time" && (
        <div style={{ width: '100%' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['TimePicker']}>
              <TimePicker
                label={label}
                ampm={false}
                value={value}
                onChange={change}
                disabled={disabled}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
      )}
      {type === "date-time" && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer
            components={[
              'DateTimePicker',
              'MobileDateTimePicker',
              'DesktopDateTimePicker',
              'StaticDateTimePicker',
            ]}
          >
            <DemoItem label={label}>
              <DesktopDateTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
            </DemoItem>
          </DemoContainer>
        </LocalizationProvider>
      )}
      {type === "search" && (
        <div className="search-wrapp">
          <div className="search-icon">
            <i className="air ai-search" />
          </div>
          <input
            type="search"
            placeholder={placeholder}
            id={name}
            onChange={change}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            className="search-input"
          />
        </div>
      )}
      {type === "checkbox" && (
        <div className="control form__checkbox mt-1">
          <label>
            <input
              type="checkbox"
              id={name}
              onBlur={handleBlur}
              onChange={change}
              value={value}
            />
          </label>
        </div>
      )}
      {errors && touched && <p className="text-error text-Nunito-Light text-xs mt-1">{errors}</p>}

      {/* {type === "dropdown" && (
        <div className={`${!blur ? 'form__dropdown' : ''}`}>
          {active && (
            options?.map((item: any, index: number) => (
              // <div>{item.value}</div>
              <div
                key={index}
                className="p-2 text-xs hover:bg-slate-300"
                // className={`p-2 text-xs hover:bg-slate-300
                //   ${item?.value?.toLowerCase().includes(value) ? 'block' : 'hidden'}`
                // }
                onClick={() => setValueSelected(item)}
              >
                {item.label}
              </div>
            ))
          )}
        </div>
      )}  */}
    </div>
  );
};

export default TextInput;
