interface NavigatorUAData {
  platform?: string
  getHighEntropyValues(hints: readonly string[]): Promise<{
    architecture?: string
    platform?: string
  }>
}

interface Navigator {
  readonly userAgentData?: NavigatorUAData
}
