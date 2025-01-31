;; Token Trove Main Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-found (err u404))
(define-constant err-unauthorized (err u401))

;; Data Variables
(define-data-var listing-count uint u0)

;; Data Maps  
(define-map token-listings
  { id: uint }
  {
    creator: principal,
    token-name: (string-utf8 64),
    token-type: (string-utf8 10), ;; FT or NFT
    description: (string-utf8 256),
    contract-address: principal,
    listing-date: uint,
    votes: uint,
    rating: uint
  }
)

;; Public Functions
(define-public (create-listing 
  (token-name (string-utf8 64))
  (token-type (string-utf8 10))
  (description (string-utf8 256))
  (contract-address principal))
  (let
    ((new-id (var-get listing-count)))
    (map-set token-listings
      { id: new-id }
      {
        creator: tx-sender,
        token-name: token-name,
        token-type: token-type, 
        description: description,
        contract-address: contract-address,
        listing-date: block-height,
        votes: u0,
        rating: u0
      }
    )
    (var-set listing-count (+ new-id u1))
    (ok new-id)
  )
)

;; Read-only functions
(define-read-only (get-listing (id uint))
  (map-get? token-listings { id: id })
)
