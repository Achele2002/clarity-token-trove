;; Voting Contract

;; Constants
(define-constant err-already-voted (err u201))
(define-constant err-invalid-rating (err u202))

;; Maps
(define-map user-votes
  { user: principal, listing-id: uint }
  { voted: bool }
)

(define-map listing-ratings 
  { listing-id: uint }
  { total-votes: uint, total-rating: uint }
)

;; Public functions  
(define-public (vote-for-listing 
  (listing-id uint)
  (rating uint))
  (begin
    (asserts! (and (>= rating u1) (<= rating u5)) err-invalid-rating)
    (let ((vote-key { user: tx-sender, listing-id: listing-id }))
      (asserts! (is-none (map-get? user-votes vote-key)) err-already-voted)
      (map-set user-votes vote-key { voted: true })
      (update-rating listing-id rating)
      (ok true)
    )
  )
)

;; Private functions
(define-private (update-rating (listing-id uint) (rating uint))
  (let ((current-rating (default-to 
    { total-votes: u0, total-rating: u0 } 
    (map-get? listing-ratings { listing-id: listing-id }))))
    (map-set listing-ratings
      { listing-id: listing-id }
      { 
        total-votes: (+ (get total-votes current-rating) u1),
        total-rating: (+ (get total-rating current-rating) rating)
      }
    )
  )
)
