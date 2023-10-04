import Image from "next/image"
import Link from "next/link"

type ButtonInterface = {
  variant?: string,
  size?: number,
  link?: string,
  className?: string,
  onClick?: any,
  disabled?: any,
  type?: any,
  loading?: boolean,
  rounded?: any,
  children: any
}

export const Button = ({
  variant,
  size,
  link,
  className,
  onClick,
  disabled,
  type,
  loading,
  rounded,
  children
}: ButtonInterface) => {

  const btnSize = () => {
    return `btn-${size}`
  }

  const btnVariant = () => {
    return `btn-${variant}`
  }

  const btnSecondary = () => {
    return `btn-secondary-${variant}`
  }

  if (link) {
    return (
      <Link
        href={link}
        className={`btn ${type !== 'secondary' ? variant ? btnVariant() : 'bg-xl-pink' : btnSecondary()} ${size ? btnSize() : ""} ${rounded ? `btn-rounded` : ""} ${size ? `w-[${size}px]` : 'w-full'} ${loading ? `loading` : ""} ${disabled ? `disabled` : ""} ${className}`}
        onClick={onClick}
      >
        {children}
      </Link>
    )
  } else {
    return (
      <button
        className={`btn ${type !== 'secondary' ? variant ? btnVariant() : 'bg-xl-pink' : btnSecondary()} ${size ? btnSize() : ""} ${rounded ? `btn-rounded` : ""} ${size ? `w-[${size}px]` : 'w-full'} ${loading ? `loading` : ""} ${disabled ? `disabled` : ""} ${className}`}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        <div className="flex items-center justify-center space-x-4">
          {loading ? (
            <>
              <div><Image src="/loading.gif" height={24} width={24} alt="Loading" /></div>
              <div className="font-Museo-Bold">Loading</div>
            </>
          ) : (
            <>{children}</>
          )}
        </div>
      </button>
    )
  }
}
