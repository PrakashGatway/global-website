import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

type IconName = keyof typeof LucideIcons;

interface DynamicLucideIconProps extends LucideProps {
  name: string;
}

export function DynamicLucideIcon({
  name,
  ...props
}: DynamicLucideIconProps) {
  const IconComponent =
    (LucideIcons as Record<string, React.FC<LucideProps>>)[name];

  if (!IconComponent) {
    // fallback icon if backend sends wrong name
    const Fallback = LucideIcons.HelpCircle;
    return <Fallback {...props} />;
  }

  return <IconComponent {...props} />;
}
