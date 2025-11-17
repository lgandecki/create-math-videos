from manim import *
import numpy as np

class WheatChessboardExponential(Scene):
    def construct(self):
        # Title scene
        title = Text("The Wheat & Chessboard", font_size=48)
        subtitle = Text("A Tale of Exponential Growth", font_size=32, color=GOLD)
        title_group = VGroup(title, subtitle).arrange(DOWN)
        self.play(Write(title), FadeIn(subtitle))
        self.wait(2)
        self.play(FadeOut(title_group))

        # Story introduction
        story_text = VGroup(
            Text("A clever mathematician asked the king for a reward:", font_size=24),
            Text("One grain of wheat on the first square,", font_size=24, color=YELLOW),
            Text("Two grains on the second,", font_size=24, color=YELLOW),
            Text("Four on the third...", font_size=24, color=YELLOW),
            Text("Doubling each time.", font_size=24, color=GOLD)
        ).arrange(DOWN, buff=0.3)
        story_text.shift(UP * 1)
        
        for line in story_text:
            self.play(Write(line), run_time=0.8)
        self.wait(2)
        self.play(FadeOut(story_text))

        # Create a simplified chessboard (8x8)
        board_size = 4  # Start with smaller visible portion
        square_size = 0.6
        
        def create_chessboard(size=8, square_size=0.6, show_all=True):
            board = VGroup()
            for i in range(size):
                for j in range(size if show_all else min(4, size)):
                    color = BLACK if (i + j) % 2 == 0 else WHITE
                    square = Square(side_length=square_size, 
                                  fill_color=color, 
                                  fill_opacity=0.7,
                                  stroke_color=GREY,
                                  stroke_width=1)
                    square.shift(RIGHT * (j - size/2 + 0.5) * square_size + 
                               UP * (i - size/2 + 0.5) * square_size)
                    board.add(square)
            return board
        
        # Create initial small board
        board = create_chessboard(4, square_size, show_all=True)
        board.shift(LEFT * 3)
        self.play(Create(board))
        
        # Create grain counter and power display
        grain_label = Text("Total Grains:", font_size=24)
        grain_count = Text("0", font_size=32, color=YELLOW)
        grain_display = VGroup(grain_label, grain_count).arrange(RIGHT, buff=0.3)
        grain_display.to_edge(UP).shift(RIGHT * 2)
        
        square_label = Text("Square:", font_size=24)
        square_num = Text("0", font_size=32, color=BLUE)
        square_display = VGroup(square_label, square_num).arrange(RIGHT, buff=0.3)
        square_display.next_to(grain_display, DOWN, buff=0.5)
        
        grains_label = Text("Grains on Square:", font_size=24)
        grains_num = Text("0", font_size=32, color=GREEN)
        grains_display = VGroup(grains_label, grains_num).arrange(RIGHT, buff=0.3)
        grains_display.next_to(square_display, DOWN, buff=0.5)
        
        self.play(
            Write(grain_display),
            Write(square_display),
            Write(grains_display)
        )
        
        # Function to create wheat grain representation
        def create_grain_pile(count, max_display=1000):
            if count <= 10:
                # Show individual grains
                grains = VGroup()
                positions = []
                for i in range(int(count)):
                    angle = i * 2 * PI / max(count, 1)
                    pos = 0.2 * np.array([np.cos(angle), np.sin(angle), 0])
                    grain = Dot(radius=0.05, color=GOLD)
                    grain.shift(pos)
                    grains.add(grain)
                return grains
            elif count <= 100:
                # Show as a small pile
                pile = Circle(radius=0.3 + np.log10(count) * 0.1, 
                            color=GOLD, 
                            fill_opacity=0.8)
                count_text = Text(f"{int(count)}", font_size=16, color=BLACK)
                count_text.move_to(pile.get_center())
                return VGroup(pile, count_text)
            else:
                # Show as larger pile with size indication
                radius = min(1.5, 0.3 + np.log10(count) * 0.15)
                pile = Circle(radius=radius, 
                            color=GOLD, 
                            fill_opacity=0.9)
                
                # Use scientific notation for large numbers
                if count >= 1e6:
                    count_str = f"{count:.2e}"
                else:
                    count_str = f"{int(count):,}"
                    
                count_text = Text(count_str, font_size=20, color=BLACK)
                count_text.move_to(pile.get_center())
                return VGroup(pile, count_text)
        
        # Animate first few squares individually
        current_grains = 0
        grain_pile = VGroup()
        
        squares_to_show = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32]
        
        for idx, square_idx in enumerate(squares_to_show):
            # Highlight current square if visible
            if square_idx <= 16:
                row = (square_idx - 1) // 4
                col = (square_idx - 1) % 4
                
                if row < 4 and col < 4:  # Only if square is visible
                    current_square = board[row * 4 + col]
                    self.play(current_square.animate.set_fill(RED, opacity=0.8), run_time=0.3)
            
            # Calculate grains
            grains_on_square = 2 ** (square_idx - 1)
            current_grains += grains_on_square
            
            # Update displays
            new_grain_count = Text(f"{current_grains:,}", font_size=32, color=YELLOW)
            new_grain_count.move_to(grain_count)
            
            new_square_num = Text(f"{square_idx}", font_size=32, color=BLUE)
            new_square_num.move_to(square_num)
            
            new_grains_num = Text(f"{grains_on_square:,}", font_size=32, color=GREEN)
            new_grains_num.move_to(grains_num)
            
            # Update grain visualization
            new_pile = create_grain_pile(grains_on_square)
            new_pile.next_to(board, RIGHT, buff=1)
            
            # Animate changes
            animations = [
                Transform(grain_count, new_grain_count),
                Transform(square_num, new_square_num),
                Transform(grains_num, new_grains_num),
            ]
            
            if len(grain_pile) > 0:
                animations.append(Transform(grain_pile, new_pile))
            else:
                grain_pile = new_pile
                animations.append(FadeIn(grain_pile))
            
            self.play(*animations, run_time=0.5 if idx < 8 else 0.3)
            
            # Return square to original color if visible
            if square_idx <= 16:
                if row < 4 and col < 4:
                    original_color = BLACK if (row + col) % 2 == 0 else WHITE
                    self.play(current_square.animate.set_fill(original_color, opacity=0.7), 
                             run_time=0.2)
        
        # Show the exponential explosion
        self.wait(1)
        
        explosion_text = VGroup(
            Text("By square 64, we need:", font_size=32),
            Text("18,446,744,073,709,551,615", font_size=36, color=RED),
            Text("grains of wheat!", font_size=32)
        ).arrange(DOWN, buff=0.3)
        explosion_text.shift(DOWN * 1)
        
        self.play(Write(explosion_text))
        self.wait(2)
        
        # Visual comparison
        self.play(
            *[FadeOut(mob) for mob in [board, grain_pile, explosion_text, 
                                      grain_display, square_display, grains_display]]
        )
        
        # Show visual scale comparison
        comparison_title = Text("To put this in perspective:", font_size=36)
        comparison_title.to_edge(UP)
        self.play(Write(comparison_title))
        
        # Create visual representations
        comparisons = VGroup()
        
        # Earth representation
        earth = Circle(radius=0.5, color=BLUE, fill_opacity=0.8)
        earth_label = Text("Earth", font_size=20)
        earth_label.next_to(earth, DOWN)
        earth_group = VGroup(earth, earth_label)
        earth_group.shift(LEFT * 4)
        
        # Wheat pile representation
        wheat_pile = Circle(radius=1.5, color=GOLD, fill_opacity=0.9)
        wheat_label = VGroup(
            Text("Wheat needed", font_size=20),
            Text("(much larger!)", font_size=16, color=RED)
        ).arrange(DOWN, buff=0.1)
        wheat_label.next_to(wheat_pile, DOWN)
        wheat_group = VGroup(wheat_pile, wheat_label)
        wheat_group.shift(RIGHT * 2)
        
        self.play(
            GrowFromCenter(earth_group),
            GrowFromCenter(wheat_group)
        )
        
        fact_text = Text("More wheat than Earth has ever produced!", 
                       font_size=28, color=YELLOW)
        fact_text.next_to(comparison_title, DOWN, buff=1)
        self.play(Write(fact_text))
        self.wait(2)
        
        # Final message
        self.play(*[FadeOut(mob) for mob in self.mobjects])
        
        final_message = VGroup(
            Text("The Power of Exponential Growth", font_size=40, color=GOLD),
            Text("Small numbers quickly become astronomical", font_size=28),
            Text("Each doubling multiplies the total dramatically", font_size=24, color=BLUE)
        ).arrange(DOWN, buff=0.5)
        
        self.play(Write(final_message))
        
        # Add final formula
        formula = Text("After 64 squares: 2^64 - 1 grains", font_size=32, color=GREEN)
        formula.next_to(final_message, DOWN, buff=1)
        self.play(Write(formula))
        
        self.wait(3)