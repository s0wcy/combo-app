type Props = {
  label: string
  width?: number | null
  action: () => void | Promise<void> | null
}

export const Button = (props: Props) => {
  // Props
  const { label, width, action } = props

  // Render
  return (
    <button
      onClick={action != null ? action : () => {}}
      className={`w-${
        width ? width : "full"
      } h-[48px] m-[8px] px-[16px] bg-blue text-white text-[14px] text-nowrap rounded-[4px]`}
    >
      {label}
    </button>
  )
}
