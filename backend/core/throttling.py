from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class SearchRateThrottle(AnonRateThrottle):
    scope = 'search'


class BurstRateThrottle(AnonRateThrottle):
    scope = 'burst'


class SustainedRateThrottle(AnonRateThrottle):
    scope = 'sustained'